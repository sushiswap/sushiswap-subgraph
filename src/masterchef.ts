import {
  AddCall,
  Deposit,
  DevCall,
  EmergencyWithdraw,
  MassUpdatePoolsCall,
  MasterChef as MasterChefContract,
  MigrateCall,
  OwnershipTransferred,
  SetCall,
  SetMigratorCall,
  UpdatePoolCall,
  Withdraw,
} from '../generated/MasterChef/MasterChef'
import { Address, BigInt, dataSource, log } from '@graphprotocol/graph-ts'
import { LOCKUP_BLOCK_NUMBER, MASTER_CHEF_ADDRESS, ZERO_BIG_INT } from './constants'
import { MasterChef, Pool, User } from '../generated/schema'

import { Pair as PairContract } from '../generated/MasterChef/Pair'

function getMasterChef(): MasterChef {
  let masterChef = MasterChef.load(dataSource.address().toHex())

  if (masterChef === null) {
    const contract = MasterChefContract.bind(dataSource.address())
    masterChef = new MasterChef(dataSource.address().toHex())
    masterChef.bonusMultiplier = contract.BONUS_MULTIPLIER()
    masterChef.bonusEndBlock = contract.bonusEndBlock()
    masterChef.devaddr = contract.devaddr()
    masterChef.migrator = contract.migrator()
    masterChef.owner = contract.owner()
    // poolInfo ...
    masterChef.startBlock = contract.startBlock()
    masterChef.sushi = contract.sushi()
    masterChef.sushiPerBlock = contract.sushiPerBlock()
    masterChef.totalAllocPoint = contract.totalAllocPoint()
    // userInfo ...
    masterChef.poolCount = BigInt.fromI32(0)

    masterChef.save()
  }

  return masterChef as MasterChef
}

export function getPool(id: BigInt): Pool {
  let pool = Pool.load(id.toString())

  if (pool === null) {
    const masterChef = getMasterChef()

    const masterChefContract = MasterChefContract.bind(dataSource.address())

    // Create new pool.
    pool = new Pool(id.toString())

    // Set relation
    pool.owner = masterChef.id

    const poolInfo = masterChefContract.poolInfo(masterChef.poolCount)

    pool.pair = poolInfo.value0
    pool.allocPoint = poolInfo.value1
    pool.lastRewardBlock = poolInfo.value2
    pool.accSushiPerShare = poolInfo.value3

    // Total supply of LP tokens
    pool.totalSupply = BigInt.fromI32(0)
    pool.userCount = BigInt.fromI32(0)

    pool.save()
  }

  return pool as Pool
}

export function getUser(pid: BigInt, address: Address): User {
  const id = pid.toString().concat('-').concat(address.toHex())

  let user = User.load(id)

  if (user === null) {
    const pool = getPool(pid)
    pool.userCount = pool.userCount.plus(BigInt.fromI32(1))
    pool.save()

    user = new User(id)
    user.pool = pool.id
    user.address = address
    user.amount = BigInt.fromI32(0)
    user.rewardDebt = BigInt.fromI32(0)
    user.pendingSushiAtLockup = BigInt.fromI32(0)
    user.harvestedSushiSinceLockup = BigInt.fromI32(0)
    user.save()
  }

  return user as User
}

export function add(event: AddCall): void {
  const masterChef = getMasterChef()

  log.info('Add pool #{}', [masterChef.poolCount.toString()])

  const pool = getPool(masterChef.poolCount)

  // Update MasterChef.
  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(pool.allocPoint)
  masterChef.poolCount = masterChef.poolCount.plus(BigInt.fromI32(1))
  masterChef.save()
}

// Calls
export function set(call: SetCall): void {
  log.info('Set pool id: {} allocPoint: {} withUpdate: {}', [
    call.inputs._pid.toString(),
    call.inputs._allocPoint.toString(),
    call.inputs._withUpdate ? 'true' : 'false',
  ])

  const pool = getPool(call.inputs._pid)

  const masterChef = getMasterChef()

  // Update masterchef
  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(call.inputs._allocPoint.minus(pool.allocPoint))
  masterChef.save()

  // Update pool
  pool.allocPoint = call.inputs._allocPoint
  pool.save()
}

export function setMigrator(call: SetMigratorCall): void {
  log.info('Set migrator to {}', [call.inputs._migrator.toHex()])

  const masterChef = getMasterChef()
  masterChef.migrator = call.inputs._migrator
  masterChef.save()
}

export function migrate(call: MigrateCall): void {
  const masterChefContract = MasterChefContract.bind(call.to)

  const pool = getPool(call.inputs._pid)

  const poolInfo = masterChefContract.poolInfo(call.inputs._pid)

  const pair = poolInfo.value0

  const pairContract = PairContract.bind(pair as Address)

  pool.pair = pair

  const totalSupply = pairContract.balanceOf(masterChefContract._address)

  pool.totalSupply = totalSupply

  pool.save()
}

export function massUpdatePools(call: MassUpdatePoolsCall): void {
  log.info('Mass update pools', [])
}

export function updatePool(call: UpdatePoolCall): void {
  log.info('Update pool id {}', [call.inputs._pid.toString()])

  const masterChef = MasterChefContract.bind(dataSource.address())
  const poolInfo = masterChef.poolInfo(call.inputs._pid)
  const pool = getPool(call.inputs._pid)
  pool.lastRewardBlock = poolInfo.value2
  pool.accSushiPerShare = poolInfo.value3
  pool.save()
}

export function dev(call: DevCall): void {
  log.info('Dev changed to {}', [call.inputs._devaddr.toHex()])

  const masterChef = getMasterChef()

  masterChef.devaddr = call.inputs._devaddr

  masterChef.save()
}

// Events
export function deposit(event: Deposit): void {
  if (event.params.amount == BigInt.fromI32(0)) {
    return
  }

  log.info('{} has deposited {} slp tokens to pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const masterChefContract = MasterChefContract.bind(dataSource.address())

  const poolInfo = masterChefContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.totalSupply = pairContract.balanceOf(masterChefContract._address)

  pool.lastRewardBlock = poolInfo.value2
  pool.accSushiPerShare = poolInfo.value3
  pool.save()

  const userInfo = masterChefContract.userInfo(event.params.pid, event.params.user)

  const user = getUser(event.params.pid, event.params.user)

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  user.save()
}

export function withdraw(event: Withdraw): void {
  if (event.params.amount == BigInt.fromI32(0)) {
    // ?
    return
  }

  log.info('{} has withdrawn {} slp tokens from pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const masterChefContract = MasterChefContract.bind(dataSource.address())

  const poolInfo = masterChefContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.totalSupply = pairContract.balanceOf(masterChefContract._address)
  pool.lastRewardBlock = poolInfo.value2
  pool.accSushiPerShare = poolInfo.value3
  pool.save()

  const user = getUser(event.params.pid, event.params.user)

  const userInfo = masterChefContract.userInfo(event.params.pid, event.params.user)

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  // Harvested sushi since lockup
  if (event.block.number.ge(LOCKUP_BLOCK_NUMBER)) {
    user.harvestedSushiSinceLockup = user.harvestedSushiSinceLockup.plus(event.params.amount)
  }

  user.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('User {} emergancy withdrawal of {} from pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const pool = getPool(event.params.pid)

  const pairContract = PairContract.bind(pool.pair as Address)
  pool.totalSupply = pairContract.balanceOf(MASTER_CHEF_ADDRESS)
  pool.save()

  // Update user
  const user = getUser(event.params.pid, event.params.user)
  user.amount = ZERO_BIG_INT
  user.rewardDebt = ZERO_BIG_INT

  // Harvested sushi since lockup
  if (event.block.number.ge(LOCKUP_BLOCK_NUMBER)) {
    user.harvestedSushiSinceLockup = user.harvestedSushiSinceLockup.plus(event.params.amount)
  }

  user.save()
}

export function ownershipTransferred(event: OwnershipTransferred): void {
  log.info('Ownership transfered from previous owner: {} to new owner: {}', [
    event.params.previousOwner.toHex(),
    event.params.newOwner.toHex(),
  ])
}

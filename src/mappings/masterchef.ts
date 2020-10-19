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
} from '../../generated/MasterChef/MasterChef'
import { Address, BigDecimal, BigInt, ByteArray, Bytes, TypedMap, dataSource, ethereum, log, store } from '@graphprotocol/graph-ts'
import { LOCKUP_BLOCK_NUMBER, MASTER_CHEF_ADDRESS, NUMBER_LITERAL_1E18, ZERO_BIG_INT } from '../constants'
import { MasterChef, Pool, UserInfo } from '../../generated/schema'
import { createLiquidityPosition, createLiquidityPositionSnapshot, getPair, getUser } from '../entities'

import { ERC20 } from '../../generated/MasterChef/ERC20'

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
    masterChef.sushi = contract.sushi().toHex()
    masterChef.sushiPerBlock = contract.sushiPerBlock()
    masterChef.totalAllocPoint = contract.totalAllocPoint()

    // const sushiTokenContract = ERC20.bind(contract.sushi())
    // masterChef.sushiTotalSupply = sushiTokenContract.totalSupply()
    // masterChef.sushiOwner = sushiTokenContract.owner()

    // userInfo ... derived from PoolUser
    masterChef.poolCount = BigInt.fromI32(0)


    masterChef.save()
  }

  return masterChef as MasterChef
}

export function updateMasterChef(): void {
  const masterChef = getMasterChef()
  const masterChefContract = MasterChefContract.bind(dataSource.address())

  masterChef.devaddr = masterChefContract.devaddr()
}

export function getPool(id: BigInt): Pool {
  log.debug("Get pool {}", [id.toString()])
  let pool = Pool.load(id.toString());

  if (pool === null) {
    const masterChef = getMasterChef()
    
    const masterChefContract = MasterChefContract.bind(dataSource.address())

    // Get poolInfo from MasterChef contract
    const poolInfo = masterChefContract.poolInfo(masterChef.poolCount)
  
    // Create new pool.
    pool = new Pool(id.toString())
  
    // Set relation
    pool.owner = masterChef.id
  
    // Standard
    pool.pair = poolInfo.value0.toHex()
    pool.allocPoint = poolInfo.value1
    pool.lastRewardBlock = poolInfo.value2
    pool.accSushiPerShare = poolInfo.value3
  
    // Total supply of LP tokens
    pool.totalSupply = BigInt.fromI32(0)
    pool.userCount = BigInt.fromI32(0) 

    pool.addresses = new Array<Bytes>();

    // pool.userInfo = new TypedMap<BigInt, TypedMap<Address, MasterChefUser>>()

    pool.save()
  }

  return pool as Pool
}

// function updatePool(id: BigInt): void {
//   const pool = getPool(id);

//   const masterChefContract = MasterChefContract.bind(dataSource.address())
//   const poolInfo = masterChefContract.poolInfo(id)

//   const lpTokenContract = ERC20.bind(poolInfo.value0)

//   pool.totalSupply = lpTokenContract.balanceOf(poolInfo.value0)
//   pool.allocPoint = poolInfo.value1
//   pool.lastRewardBlock = poolInfo.value2
//   pool.accSushiPerShare = poolInfo.value3

//   pool.save()
// }

export function getUserInfo(pid: BigInt, user: Address, block: ethereum.Block = null): UserInfo {
  const id = pid.toString().concat("-").concat(user.toHex())
  
  let userInfo = UserInfo.load(id)

  if (userInfo === null) {
    const pool = getPool(pid)

    userInfo = new UserInfo(id)
    userInfo.pool = pool.id
    userInfo.user = user.toHex()
    userInfo.amount = BigInt.fromI32(0)
    userInfo.rewardDebt = BigInt.fromI32(0)
    userInfo.pendingSushiAtLockup = BigInt.fromI32(0)
    userInfo.harvestedSushiSinceLockup = BigInt.fromI32(0)
    // First seen...
    userInfo.block = block.number.toI32()
    userInfo.timestamp = block.timestamp.toI32()
    userInfo.save()

    // TODO: Shouldnt be doing this here
    const addresses = pool.addresses
    addresses.push(user)
    pool.addresses = addresses
    log.info("pool addresses length {}", [BigInt.fromI32(pool.addresses.length).toString()])
    pool.userCount = pool.userCount.plus(BigInt.fromI32(1))
    pool.save()
  }

  return userInfo as UserInfo
}

export function add(event: AddCall): void {
  const masterChef = getMasterChef()

  log.info('Add pool #{}', [event.from.toHex()])

  getUser(event.from)

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
  log.info('Migrate pool id: {}', [call.inputs._pid.toString()])

  const masterChef = getMasterChef()
  const masterChefContract = MasterChefContract.bind(call.to)
  
  const pool = getPool(call.inputs._pid)

  // log.info('Migrate got pool {}', [pool.id])

  const lpToken = masterChefContract.poolInfo(call.inputs._pid).value0

  // log.info('Migrate token {}', [lpToken.toHex()])

  const lpTokenContract = ERC20.bind(lpToken)

  log.info('Migrate pool addresses length is: {}', [BigInt.fromI32(pool.addresses.length).toString()])

  const addresses = pool.addresses
  
  for (let i = 0; i < addresses.length; i++) {
    // log.info("Migrate user {} from pool {} ...", [poolUserInfo[i].split('-')[1], poolUserInfo[i].split('-')[0]])   
    const user = addresses[i]

    const userInfo = masterChefContract.userInfo(call.inputs._pid, user as Address)

    // Ignore if user has no value in masterchef at migration
    if (userInfo.value0.equals(ZERO_BIG_INT)) {
      continue
    }

    // const masterChefUser = getMasterChefUser(call.inputs._pid, user.toHex())
    const liquidityPosition = createLiquidityPosition(user as Address, lpToken, call.block)
    
    // Users balance at the time
    const liquidityTokenBalance = lpTokenContract.balanceOf(user as Address).divDecimal(NUMBER_LITERAL_1E18)
    
    // Plus amount in masterchef
    const amount = userInfo.value0.divDecimal(NUMBER_LITERAL_1E18)
      
    liquidityPosition.liquidityTokenBalance = liquidityTokenBalance.plus(amount)
    
    liquidityPosition.save()

    // log.info("Migrate user {} amount {} liquidityTokenBalance {}", [poolUserInfo[i].split('-')[1], amount.toString(), liquidityPosition.liquidityTokenBalance.toString()])

    createLiquidityPositionSnapshot(liquidityPosition, call.block)

    // masterChefUser.save()
  }

  pool.pair = lpToken.toHex()
  pool.totalSupply = lpTokenContract.balanceOf(masterChefContract._address)
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
export function onDeposit(event: Deposit): void {

  if (event.params.amount == BigInt.fromI32(0)) {
    return
  }

  // log.info('{} deposited {} slp tokens to pool #{}', [
  //   event.params.user.toHex(),
  //   event.params.amount.toString(),
  //   event.params.pid.toString(),
  // ])

  const masterChefContract = MasterChefContract.bind(dataSource.address())

  const poolInfo = masterChefContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid)

  const lpTokenContract = ERC20.bind(poolInfo.value0)

  pool.totalSupply = lpTokenContract.balanceOf(poolInfo.value0)
  pool.lastRewardBlock = poolInfo.value2
  pool.accSushiPerShare = poolInfo.value3
  pool.save()

  const userInfoResult = masterChefContract.userInfo(event.params.pid, event.params.user)

  const userInfo = getUserInfo(event.params.pid, event.params.user, event.block)
  userInfo.amount = userInfoResult.value0
  userInfo.rewardDebt = userInfoResult.value1
  userInfo.save()
  
  // if (migrationMap.isSet(poolInfo.value0)) {
  //   const lp = createLiquidityPosition(event.params.user, migrationMap.get(poolInfo.value0) as Address, event.block)
  //   lp.liquidityTokenBalance = lp.liquidityTokenBalance.plus(event.params.amount.divDecimal(BigDecimal.fromString("1e18")))
  //   lp.save()
  //   createLiquidityPositionSnapshot(lp, event.block)
  // }  
}

export function onWithdraw(event: Withdraw): void {

  if (event.params.amount == BigInt.fromI32(0)) {
    return
  }

  // log.info('{} withdrew {} slp tokens from pool #{}', [
  //   event.params.user.toHex(),
  //   event.params.amount.toString(),
  //   event.params.pid.toString(),
  // ])

  const masterChefContract = MasterChefContract.bind(dataSource.address())

  const poolInfoResult = masterChefContract.poolInfo(event.params.pid)

  const userInfoResult = masterChefContract.userInfo(event.params.pid, event.params.user)

  const pool = getPool(event.params.pid)

  const lpTokenContract = ERC20.bind(poolInfoResult.value0)

  pool.totalSupply = lpTokenContract.balanceOf(poolInfoResult.value0)
  pool.lastRewardBlock = poolInfoResult.value2
  pool.accSushiPerShare = poolInfoResult.value3

  if (userInfoResult.value0.equals(ZERO_BIG_INT)) {
    pool.addresses.splice(pool.addresses.indexOf(event.params.user), 1)
  }

  pool.save()

  const userInfo = getUserInfo(event.params.pid, event.params.user, event.block)

  userInfo.amount = userInfoResult.value0
  userInfo.rewardDebt = userInfoResult.value1
  
  // Harvested sushi since lockup
  if (event.block.number.ge(LOCKUP_BLOCK_NUMBER)) {
    userInfo.harvestedSushiSinceLockup = userInfo.harvestedSushiSinceLockup.plus(event.params.amount)
  }

  userInfo.save()
}

export function onEmergencyWithdraw(event: EmergencyWithdraw): void {

  log.info('User {} emergancy withdrawal of {} from pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  // Update pool
  const pool = getPool(event.params.pid)

  const lpTokenContract = ERC20.bind(Address.fromString(pool.pair))

  pool.totalSupply = lpTokenContract.balanceOf(Address.fromString(pool.owner))
  pool.save()

  // Update user
  const userInfo = getUserInfo(event.params.pid, event.params.user, event.block)
  userInfo.amount = ZERO_BIG_INT
  userInfo.rewardDebt = ZERO_BIG_INT

  // Harvested sushi since lockup
  if (event.block.number.ge(LOCKUP_BLOCK_NUMBER)) {
    userInfo.harvestedSushiSinceLockup = userInfo.harvestedSushiSinceLockup.plus(event.params.amount)
  }

  userInfo.save()
}

export function onOwnershipTransferred(event: OwnershipTransferred): void {
  log.info('Ownership transfered from previous owner: {} to new owner: {}', [
    event.params.previousOwner.toHex(),
    event.params.newOwner.toHex(),
  ])
}

export function block(block: ethereum.Block): void {
  if (block.number == LOCKUP_BLOCK_NUMBER) {
    log.info('Start of lockup', [])

    // TODO: At this point we should get all users and store their pendingSushi at lockup.
    // Futhermore to calculate sushi in lockup from that point onwards we do
    // (pendingSushiAtLockup + pendingSushi + withdrawnSushi) * 2

    // const masterChef = getMasterChef()
    const masterChefContract = MasterChefContract.bind(dataSource.address())

    const poolLength = masterChefContract.poolLength().toI32()

    for (let i = 0; i < poolLength; i++) {
      const pid = BigInt.fromI32(i)
      const pool = getPool(pid)
      // const poolInfo = masterChefContract.poolInfo(pid)
      const addresses = pool.addresses
      for (let j = 0; j < addresses.length; j++) {
        // log.info("Lockup user {}", [userInfo[j].split("-")[1].toString()])
        const user = addresses[j]
        const userInfo = getUserInfo(pid, user as Address)
        const pendingSushiAtLockup = masterChefContract.pendingSushi(
          pid,
          user as Address
        )
        // log.info('Pending sushi for {} at lockup is {}', [user, pendingSushiAtLockup.toString()])   
        userInfo.pendingSushiAtLockup = pendingSushiAtLockup
        userInfo.save()
      }
    }
  }
  // Later we add a case for when lockup is ending, once there's more clarity in that area.

  // TODO: If past all migrations, remove addresses array from pools
}

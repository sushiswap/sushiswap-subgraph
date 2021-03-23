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
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E12,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  MASTER_CHEF_ADDRESS,
  MASTER_CHEF_START_BLOCK,
} from 'const'
import { History, MasterChef, Pool, PoolHistory, User } from '../generated/schema'
import { getSushiPrice, getUSDRate } from 'pricing'

import { ERC20 as ERC20Contract } from '../generated/MasterChef/ERC20'
import { Pair as PairContract } from '../generated/MasterChef/Pair'

function getMasterChef(block: ethereum.Block): MasterChef {
  let masterChef = MasterChef.load(MASTER_CHEF_ADDRESS.toHex())

  if (masterChef === null) {
    const contract = MasterChefContract.bind(MASTER_CHEF_ADDRESS)
    masterChef = new MasterChef(MASTER_CHEF_ADDRESS.toHex())
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
    masterChef.poolCount = BIG_INT_ZERO

    masterChef.slpBalance = BIG_DECIMAL_ZERO
    masterChef.slpAge = BIG_DECIMAL_ZERO
    masterChef.slpAgeRemoved = BIG_DECIMAL_ZERO
    masterChef.slpDeposited = BIG_DECIMAL_ZERO
    masterChef.slpWithdrawn = BIG_DECIMAL_ZERO

    masterChef.updatedAt = block.timestamp

    masterChef.save()
  }

  return masterChef as MasterChef
}

export function getPool(id: BigInt, block: ethereum.Block): Pool {
  let pool = Pool.load(id.toString())

  if (pool === null) {
    const masterChef = getMasterChef(block)

    const masterChefContract = MasterChefContract.bind(MASTER_CHEF_ADDRESS)

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
    pool.balance = BIG_INT_ZERO
    pool.userCount = BIG_INT_ZERO

    pool.slpBalance = BIG_DECIMAL_ZERO
    pool.slpAge = BIG_DECIMAL_ZERO
    pool.slpAgeRemoved = BIG_DECIMAL_ZERO
    pool.slpDeposited = BIG_DECIMAL_ZERO
    pool.slpWithdrawn = BIG_DECIMAL_ZERO

    pool.timestamp = block.timestamp
    pool.block = block.number

    pool.updatedAt = block.timestamp
    pool.entryUSD = BIG_DECIMAL_ZERO
    pool.exitUSD = BIG_DECIMAL_ZERO
    pool.sushiHarvested = BIG_DECIMAL_ZERO
    pool.sushiHarvestedUSD = BIG_DECIMAL_ZERO
    pool.save()
  }

  return pool as Pool
}

function getHistory(owner: string, block: ethereum.Block): History {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = owner.concat(day.toString())

  let history = History.load(id)

  if (history === null) {
    history = new History(id)
    history.owner = owner
    history.slpBalance = BIG_DECIMAL_ZERO
    history.slpAge = BIG_DECIMAL_ZERO
    history.slpAgeRemoved = BIG_DECIMAL_ZERO
    history.slpDeposited = BIG_DECIMAL_ZERO
    history.slpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
  }

  return history as History
}

function getPoolHistory(pool: Pool, block: ethereum.Block): PoolHistory {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = pool.id.concat(day.toString())

  let history = PoolHistory.load(id)

  if (history === null) {
    history = new PoolHistory(id)
    history.pool = pool.id
    history.slpBalance = BIG_DECIMAL_ZERO
    history.slpAge = BIG_DECIMAL_ZERO
    history.slpAgeRemoved = BIG_DECIMAL_ZERO
    history.slpDeposited = BIG_DECIMAL_ZERO
    history.slpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
    history.entryUSD = BIG_DECIMAL_ZERO
    history.exitUSD = BIG_DECIMAL_ZERO
    history.sushiHarvested = BIG_DECIMAL_ZERO
    history.sushiHarvestedUSD = BIG_DECIMAL_ZERO
  }

  return history as PoolHistory
}

export function getUser(pid: BigInt, address: Address, block: ethereum.Block): User {
  const uid = address.toHex()
  const id = pid.toString().concat('-').concat(uid)

  let user = User.load(id)

  if (user === null) {
    user = new User(id)
    user.pool = null
    user.address = address
    user.amount = BIG_INT_ZERO
    user.rewardDebt = BIG_INT_ZERO
    user.sushiHarvested = BIG_DECIMAL_ZERO
    user.sushiHarvestedUSD = BIG_DECIMAL_ZERO
    user.entryUSD = BIG_DECIMAL_ZERO
    user.exitUSD = BIG_DECIMAL_ZERO
    user.timestamp = block.timestamp
    user.block = block.number
    user.save()
  }

  return user as User
}

export function add(event: AddCall): void {
  const masterChef = getMasterChef(event.block)

  log.info('Add pool #{}', [masterChef.poolCount.toString()])

  const pool = getPool(masterChef.poolCount, event.block)

  // Update MasterChef.
  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(pool.allocPoint)
  masterChef.poolCount = masterChef.poolCount.plus(BIG_INT_ONE)
  masterChef.save()
}

// Calls
export function set(call: SetCall): void {
  log.info('Set pool id: {} allocPoint: {} withUpdate: {}', [
    call.inputs._pid.toString(),
    call.inputs._allocPoint.toString(),
    call.inputs._withUpdate ? 'true' : 'false',
  ])

  const pool = getPool(call.inputs._pid, call.block)

  const masterChef = getMasterChef(call.block)

  // Update masterchef
  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(call.inputs._allocPoint.minus(pool.allocPoint))
  masterChef.save()

  // Update pool
  pool.allocPoint = call.inputs._allocPoint
  pool.save()
}

export function setMigrator(call: SetMigratorCall): void {
  log.info('Set migrator to {}', [call.inputs._migrator.toHex()])

  const masterChef = getMasterChef(call.block)
  masterChef.migrator = call.inputs._migrator
  masterChef.save()
}

export function migrate(call: MigrateCall): void {
  const masterChefContract = MasterChefContract.bind(MASTER_CHEF_ADDRESS)

  const pool = getPool(call.inputs._pid, call.block)

  const poolInfo = masterChefContract.poolInfo(call.inputs._pid)

  const pair = poolInfo.value0

  const pairContract = PairContract.bind(pair as Address)

  pool.pair = pair

  const balance = pairContract.balanceOf(MASTER_CHEF_ADDRESS)

  pool.balance = balance

  pool.save()
}

export function massUpdatePools(call: MassUpdatePoolsCall): void {
  log.info('Mass update pools', [])
}

export function updatePool(call: UpdatePoolCall): void {
  log.info('Update pool id {}', [call.inputs._pid.toString()])

  const masterChef = MasterChefContract.bind(MASTER_CHEF_ADDRESS)
  const poolInfo = masterChef.poolInfo(call.inputs._pid)
  const pool = getPool(call.inputs._pid, call.block)
  pool.lastRewardBlock = poolInfo.value2
  pool.accSushiPerShare = poolInfo.value3
  pool.save()
}

export function dev(call: DevCall): void {
  log.info('Dev changed to {}', [call.inputs._devaddr.toHex()])

  const masterChef = getMasterChef(call.block)

  masterChef.devaddr = call.inputs._devaddr

  masterChef.save()
}

// Events
export function deposit(event: Deposit): void {
  // if (event.params.amount == BIG_INT_ZERO) {
  //   log.info('Deposit zero transaction, input {} hash {}', [
  //     event.transaction.input.toHex(),
  //     event.transaction.hash.toHex(),
  //   ])
  // }

  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)

  // log.info('{} has deposited {} slp tokens to pool #{}', [
  //   event.params.user.toHex(),
  //   event.params.amount.toString(),
  //   event.params.pid.toString(),
  // ])

  const masterChefContract = MasterChefContract.bind(MASTER_CHEF_ADDRESS)

  const poolInfo = masterChefContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid, event.block)

  const poolHistory = getPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(MASTER_CHEF_ADDRESS)

  pool.lastRewardBlock = poolInfo.value2
  pool.accSushiPerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  pool.slpAge = pool.slpAge.plus(poolDays.times(pool.slpBalance))

  pool.slpDeposited = pool.slpDeposited.plus(amount)
  pool.slpBalance = pool.slpBalance.plus(amount)

  pool.updatedAt = event.block.timestamp

  const userInfo = masterChefContract.userInfo(event.params.pid, event.params.user)

  const user = getUser(event.params.pid, event.params.user, event.block)

  // If not currently in pool and depositing SLP
  if (!user.pool && event.params.amount.gt(BIG_INT_ZERO)) {
    user.pool = pool.id
    pool.userCount = pool.userCount.plus(BIG_INT_ONE)
  }

  // Calculate SUSHI being paid out
  if (event.block.number.gt(MASTER_CHEF_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accSushiPerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    // log.info('Deposit: User amount is more than zero, we should harvest {} sushi', [pending.toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      // log.info('Harvesting {} SUSHI', [pending.toString()])
      const sushiHarvestedUSD = pending.times(getSushiPrice(event.block))
      user.sushiHarvested = user.sushiHarvested.plus(pending)
      user.sushiHarvestedUSD = user.sushiHarvestedUSD.plus(sushiHarvestedUSD)
      pool.sushiHarvested = pool.sushiHarvested.plus(pending)
      pool.sushiHarvestedUSD = pool.sushiHarvestedUSD.plus(sushiHarvestedUSD)
      poolHistory.sushiHarvested = pool.sushiHarvested
      poolHistory.sushiHarvestedUSD = pool.sushiHarvestedUSD
    }
  }

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()
    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const entryUSD = token0USD.plus(token1USD)

      // log.info(
      //   'Token {} priceUSD: {} reserve: {} amount: {} / Token {} priceUSD: {} reserve: {} amount: {} - slp amount: {} total supply: {} share: {}',
      //   [
      //     token0.symbol(),
      //     token0PriceUSD.toString(),
      //     reservesResult.value.value0.toString(),
      //     token0Amount.toString(),
      //     token1.symbol(),
      //     token1PriceUSD.toString(),
      //     reservesResult.value.value1.toString(),
      //     token1Amount.toString(),
      //     amount.toString(),
      //     totalSupply.toString(),
      //     share.toString(),
      //   ]
      // )

      // log.info('User {} has deposited {} SLP tokens {} {} (${}) and {} {} (${}) at a combined value of ${}', [
      //   user.address.toHex(),
      //   amount.toString(),
      //   token0Amount.toString(),
      //   token0.symbol(),
      //   token0USD.toString(),
      //   token1Amount.toString(),
      //   token1.symbol(),
      //   token1USD.toString(),
      //   entryUSD.toString(),
      // ])

      user.entryUSD = user.entryUSD.plus(entryUSD)

      pool.entryUSD = pool.entryUSD.plus(entryUSD)

      poolHistory.entryUSD = pool.entryUSD
    }
  }

  user.save()
  pool.save()

  const masterChef = getMasterChef(event.block)

  const masterChefDays = event.block.timestamp.minus(masterChef.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  masterChef.slpAge = masterChef.slpAge.plus(masterChefDays.times(masterChef.slpBalance))

  masterChef.slpDeposited = masterChef.slpDeposited.plus(amount)
  masterChef.slpBalance = masterChef.slpBalance.plus(amount)

  masterChef.updatedAt = event.block.timestamp
  masterChef.save()

  const history = getHistory(MASTER_CHEF_ADDRESS.toHex(), event.block)
  history.slpAge = masterChef.slpAge
  history.slpBalance = masterChef.slpBalance
  history.slpDeposited = history.slpDeposited.plus(amount)
  history.save()

  poolHistory.slpAge = pool.slpAge
  poolHistory.slpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.slpDeposited = poolHistory.slpDeposited.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function withdraw(event: Withdraw): void {
  // if (event.params.amount == BIG_INT_ZERO && User.load(event.params.user.toHex()) !== null) {
  //   log.info('Withdrawal zero transaction, input {} hash {}', [
  //     event.transaction.input.toHex(),
  //     event.transaction.hash.toHex(),
  //   ])
  // }

  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)

  // log.info('{} has withdrawn {} slp tokens from pool #{}', [
  //   event.params.user.toHex(),
  //   amount.toString(),
  //   event.params.pid.toString(),
  // ])

  const masterChefContract = MasterChefContract.bind(MASTER_CHEF_ADDRESS)

  const poolInfo = masterChefContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid, event.block)

  const poolHistory = getPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(MASTER_CHEF_ADDRESS)
  pool.lastRewardBlock = poolInfo.value2
  pool.accSushiPerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const poolAge = pool.slpAge.plus(poolDays.times(pool.slpBalance))
  const poolAgeRemoved = poolAge.div(pool.slpBalance).times(amount)
  pool.slpAge = poolAge.minus(poolAgeRemoved)
  pool.slpAgeRemoved = pool.slpAgeRemoved.plus(poolAgeRemoved)
  pool.slpWithdrawn = pool.slpWithdrawn.plus(amount)
  pool.slpBalance = pool.slpBalance.minus(amount)
  pool.updatedAt = event.block.timestamp

  const user = getUser(event.params.pid, event.params.user, event.block)

  if (event.block.number.gt(MASTER_CHEF_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accSushiPerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    // log.info('Withdraw: User amount is more than zero, we should harvest {} sushi - block: {}', [
    //   pending.toString(),
    //   event.block.number.toString(),
    // ])
    // log.info('SUSHI PRICE {}', [getSushiPrice(event.block).toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      // log.info('Harvesting {} SUSHI (CURRENT SUSHI PRICE {})', [
      //   pending.toString(),
      //   getSushiPrice(event.block).toString(),
      // ])
      const sushiHarvestedUSD = pending.times(getSushiPrice(event.block))
      user.sushiHarvested = user.sushiHarvested.plus(pending)
      user.sushiHarvestedUSD = user.sushiHarvestedUSD.plus(sushiHarvestedUSD)
      pool.sushiHarvested = pool.sushiHarvested.plus(pending)
      pool.sushiHarvestedUSD = pool.sushiHarvestedUSD.plus(sushiHarvestedUSD)
      poolHistory.sushiHarvested = pool.sushiHarvested
      poolHistory.sushiHarvestedUSD = pool.sushiHarvestedUSD
    }
  }

  const userInfo = masterChefContract.userInfo(event.params.pid, event.params.user)

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()

    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const exitUSD = token0USD.plus(token1USD)

      pool.exitUSD = pool.exitUSD.plus(exitUSD)

      poolHistory.exitUSD = pool.exitUSD

      // log.info('User {} has withdrwn {} SLP tokens {} {} (${}) and {} {} (${}) at a combined value of ${}', [
      //   user.address.toHex(),
      //   amount.toString(),
      //   token0Amount.toString(),
      //   token0USD.toString(),
      //   pairContract.token0().toHex(),
      //   token1Amount.toString(),
      //   token1USD.toString(),
      //   pairContract.token1().toHex(),
      //   exitUSD.toString(),
      // ])

      user.exitUSD = user.exitUSD.plus(exitUSD)
    } else {
      log.info("Withdraw couldn't get reserves for pair {}", [poolInfo.value0.toHex()])
    }
  }

  // If SLP amount equals zero, remove from pool and reduce userCount
  if (user.amount.equals(BIG_INT_ZERO)) {
    user.pool = null
    pool.userCount = pool.userCount.minus(BIG_INT_ONE)
  }

  user.save()
  pool.save()

  const masterChef = getMasterChef(event.block)

  const days = event.block.timestamp.minus(masterChef.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const slpAge = masterChef.slpAge.plus(days.times(masterChef.slpBalance))
  const slpAgeRemoved = slpAge.div(masterChef.slpBalance).times(amount)
  masterChef.slpAge = slpAge.minus(slpAgeRemoved)
  masterChef.slpAgeRemoved = masterChef.slpAgeRemoved.plus(slpAgeRemoved)

  masterChef.slpWithdrawn = masterChef.slpWithdrawn.plus(amount)
  masterChef.slpBalance = masterChef.slpBalance.minus(amount)
  masterChef.updatedAt = event.block.timestamp
  masterChef.save()

  const history = getHistory(MASTER_CHEF_ADDRESS.toHex(), event.block)
  history.slpAge = masterChef.slpAge
  history.slpAgeRemoved = history.slpAgeRemoved.plus(slpAgeRemoved)
  history.slpBalance = masterChef.slpBalance
  history.slpWithdrawn = history.slpWithdrawn.plus(amount)
  history.save()

  poolHistory.slpAge = pool.slpAge
  poolHistory.slpAgeRemoved = poolHistory.slpAgeRemoved.plus(slpAgeRemoved)
  poolHistory.slpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.slpWithdrawn = poolHistory.slpWithdrawn.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('User {} emergancy withdrawal of {} from pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const pool = getPool(event.params.pid, event.block)

  const pairContract = PairContract.bind(pool.pair as Address)
  pool.balance = pairContract.balanceOf(MASTER_CHEF_ADDRESS)
  pool.save()

  // Update user
  const user = getUser(event.params.pid, event.params.user, event.block)
  user.amount = BIG_INT_ZERO
  user.rewardDebt = BIG_INT_ZERO

  user.save()
}

export function ownershipTransferred(event: OwnershipTransferred): void {
  log.info('Ownership transfered from previous owner: {} to new owner: {}', [
    event.params.previousOwner.toHex(),
    event.params.newOwner.toHex(),
  ])
}

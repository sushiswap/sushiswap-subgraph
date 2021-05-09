import {
  AddCall,
  Deposit,
  DevCall,
  EmergencyWithdraw,
  MassUpdatePoolsCall,
  TopDog as TopDogContract,
  MigrateCall,
  OwnershipTransferred,
  SetCall,
  SetMigratorCall,
  UpdatePoolCall,
  Withdraw,
} from '../generated/TopDog/TopDog'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E12,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  SHIBASWAP_TOPDOG_ADDRESS,
  SHIBASWAP_TOPDOG_START_BLOCK,
} from 'const'
import { History, TopDog, Pool, PoolHistory, User } from '../generated/schema'
import { getBonePrice, getUSDRate } from 'pricing'

import { ERC20 as ERC20Contract } from '../generated/TopDog/ERC20'
import { Pair as PairContract } from '../generated/TopDog/Pair'

function getTopDog(block: ethereum.Block): TopDog {
  let topDog = TopDog.load(SHIBASWAP_TOPDOG_ADDRESS.toHex())

  if (topDog === null) {
    const contract = TopDogContract.bind(SHIBASWAP_TOPDOG_ADDRESS)
    topDog = new TopDog(SHIBASWAP_TOPDOG_ADDRESS.toHex())
    topDog.bonusMultiplier = contract.BONUS_MULTIPLIER()
    topDog.bonusEndBlock = contract.bonusEndBlock()
    topDog.devaddr = contract.devaddr()
    topDog.migrator = contract.migrator()
    topDog.owner = contract.owner()
    // poolInfo ...
    topDog.startBlock = contract.startBlock()
    topDog.bone = contract.bone()
    topDog.bonePerBlock = contract.bonePerBlock()
    topDog.totalAllocPoint = contract.totalAllocPoint()
    // userInfo ...
    topDog.poolCount = BIG_INT_ZERO

    topDog.sslpBalance = BIG_DECIMAL_ZERO
    topDog.sslpAge = BIG_DECIMAL_ZERO
    topDog.sslpAgeRemoved = BIG_DECIMAL_ZERO
    topDog.sslpDeposited = BIG_DECIMAL_ZERO
    topDog.sslpWithdrawn = BIG_DECIMAL_ZERO

    topDog.updatedAt = block.timestamp

    topDog.save()
  }

  return topDog as TopDog
}


export function getPool(id: BigInt, block: ethereum.Block): Pool {
  let pool = Pool.load(id.toString())

  if (pool === null) {
    const topDpg = getTopDog(block)

    const topDogContract = TopDogContract.bind(SHIBASWAP_TOPDOG_ADDRESS)

    // Create new pool.
    pool = new Pool(id.toString())

    // Set relation
    pool.owner = topDpg.id

    const poolInfo = topDogContract.poolInfo(topDpg.poolCount)

    pool.pair = poolInfo.value0
    pool.allocPoint = poolInfo.value1
    pool.lastRewardBlock = poolInfo.value2
    pool.accBonePerShare = poolInfo.value3

    // Total supply of LP tokens
    pool.balance = BIG_INT_ZERO
    pool.userCount = BIG_INT_ZERO

    pool.sslpBalance = BIG_DECIMAL_ZERO
    pool.sslpAge = BIG_DECIMAL_ZERO
    pool.sslpAgeRemoved = BIG_DECIMAL_ZERO
    pool.sslpDeposited = BIG_DECIMAL_ZERO
    pool.sslpWithdrawn = BIG_DECIMAL_ZERO

    pool.timestamp = block.timestamp
    pool.block = block.number

    pool.updatedAt = block.timestamp
    pool.entryUSD = BIG_DECIMAL_ZERO
    pool.exitUSD = BIG_DECIMAL_ZERO
    pool.boneHarvested = BIG_DECIMAL_ZERO
    pool.boneHarvestedUSD = BIG_DECIMAL_ZERO
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
    history.sslpBalance = BIG_DECIMAL_ZERO
    history.sslpAge = BIG_DECIMAL_ZERO
    history.sslpAgeRemoved = BIG_DECIMAL_ZERO
    history.sslpDeposited = BIG_DECIMAL_ZERO
    history.sslpWithdrawn = BIG_DECIMAL_ZERO
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
    history.sslpBalance = BIG_DECIMAL_ZERO
    history.sslpAge = BIG_DECIMAL_ZERO
    history.sslpAgeRemoved = BIG_DECIMAL_ZERO
    history.sslpDeposited = BIG_DECIMAL_ZERO
    history.sslpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
    history.entryUSD = BIG_DECIMAL_ZERO
    history.exitUSD = BIG_DECIMAL_ZERO
    history.boneHarvested = BIG_DECIMAL_ZERO
    history.boneHarvestedUSD = BIG_DECIMAL_ZERO
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
    user.boneHarvested = BIG_DECIMAL_ZERO
    user.boneHarvestedUSD = BIG_DECIMAL_ZERO
    user.entryUSD = BIG_DECIMAL_ZERO
    user.exitUSD = BIG_DECIMAL_ZERO
    user.timestamp = block.timestamp
    user.block = block.number
    user.save()
  }

  return user as User
}

export function add(event: AddCall): void {
  const topDpg = getTopDog(event.block)

  log.info('Add pool #{}', [topDpg.poolCount.toString()])

  const pool = getPool(topDpg.poolCount, event.block)

  // Update TopDog.
  topDpg.totalAllocPoint = topDpg.totalAllocPoint.plus(pool.allocPoint)
  topDpg.poolCount = topDpg.poolCount.plus(BIG_INT_ONE)
  topDpg.save()
}

// Calls
export function set(call: SetCall): void {
  log.info('Set pool id: {} allocPoint: {} withUpdate: {}', [
    call.inputs._pid.toString(),
    call.inputs._allocPoint.toString(),
    call.inputs._withUpdate ? 'true' : 'false',
  ])

  const pool = getPool(call.inputs._pid, call.block)

  const topDpg = getTopDog(call.block)

  // Update topdog
  topDpg.totalAllocPoint = topDpg.totalAllocPoint.plus(call.inputs._allocPoint.minus(pool.allocPoint))
  topDpg.save()

  // Update pool
  pool.allocPoint = call.inputs._allocPoint
  pool.save()
}

export function setMigrator(call: SetMigratorCall): void {
  log.info('Set migrator to {}', [call.inputs._migrator.toHex()])

  const topDpg = getTopDog(call.block)
  topDpg.migrator = call.inputs._migrator
  topDpg.save()
}

export function migrate(call: MigrateCall): void {
  const topDogContract = TopDogContract.bind(SHIBASWAP_TOPDOG_ADDRESS)

  const pool = getPool(call.inputs._pid, call.block)

  const poolInfo = topDogContract.poolInfo(call.inputs._pid)

  const pair = poolInfo.value0

  const pairContract = PairContract.bind(pair as Address)

  pool.pair = pair

  const balance = pairContract.balanceOf(SHIBASWAP_TOPDOG_ADDRESS)

  pool.balance = balance

  pool.save()
}

export function massUpdatePools(call: MassUpdatePoolsCall): void {
  log.info('Mass update pools', [])
}

export function updatePool(call: UpdatePoolCall): void {
  log.info('Update pool id {}', [call.inputs._pid.toString()])

  const topDpg = TopDogContract.bind(SHIBASWAP_TOPDOG_ADDRESS)
  const poolInfo = topDpg.poolInfo(call.inputs._pid)
  const pool = getPool(call.inputs._pid, call.block)
  pool.lastRewardBlock = poolInfo.value2
  pool.accBonePerShare = poolInfo.value3
  pool.save()
}

export function dev(call: DevCall): void {
  log.info('Dev changed to {}', [call.inputs._devaddr.toHex()])

  const topDpg = getTopDog(call.block)

  topDpg.devaddr = call.inputs._devaddr

  topDpg.save()
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

  const topDogContract = TopDogContract.bind(SHIBASWAP_TOPDOG_ADDRESS)

  const poolInfo = topDogContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid, event.block)

  const poolHistory = getPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(SHIBASWAP_TOPDOG_ADDRESS)

  pool.lastRewardBlock = poolInfo.value2
  pool.accBonePerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  pool.sslpAge = pool.sslpAge.plus(poolDays.times(pool.sslpBalance))

  pool.sslpDeposited = pool.sslpDeposited.plus(amount)
  pool.sslpBalance = pool.sslpBalance.plus(amount)

  pool.updatedAt = event.block.timestamp

  const userInfo = topDogContract.userInfo(event.params.pid, event.params.user)

  const user = getUser(event.params.pid, event.params.user, event.block)

  // If not currently in pool and depositing SLP
  if (!user.pool && event.params.amount.gt(BIG_INT_ZERO)) {
    user.pool = pool.id
    pool.userCount = pool.userCount.plus(BIG_INT_ONE)
  }

  // Calculate BONE being paid out
  if (event.block.number.gt(SHIBASWAP_TOPDOG_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accBonePerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    // log.info('Deposit: User amount is more than zero, we should harvest {} bone', [pending.toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      // log.info('Harvesting {} BONE', [pending.toString()])
      const boneHarvestedUSD = pending.times(getBonePrice(event.block))
      user.boneHarvested = user.boneHarvested.plus(pending)
      user.boneHarvestedUSD = user.boneHarvestedUSD.plus(boneHarvestedUSD)
      pool.boneHarvested = pool.boneHarvested.plus(pending)
      pool.boneHarvestedUSD = pool.boneHarvestedUSD.plus(boneHarvestedUSD)
      poolHistory.boneHarvested = pool.boneHarvested
      poolHistory.boneHarvestedUSD = pool.boneHarvestedUSD
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

  const topDpg = getTopDog(event.block)

  const topDogDays = event.block.timestamp.minus(topDpg.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  topDpg.sslpAge = topDpg.sslpAge.plus(topDogDays.times(topDpg.sslpBalance))

  topDpg.sslpDeposited = topDpg.sslpDeposited.plus(amount)
  topDpg.sslpBalance = topDpg.sslpBalance.plus(amount)

  topDpg.updatedAt = event.block.timestamp
  topDpg.save()

  const history = getHistory(SHIBASWAP_TOPDOG_ADDRESS.toHex(), event.block)
  history.sslpAge = topDpg.sslpAge
  history.sslpBalance = topDpg.sslpBalance
  history.sslpDeposited = history.sslpDeposited.plus(amount)
  history.save()

  poolHistory.sslpAge = pool.sslpAge
  poolHistory.sslpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.sslpDeposited = poolHistory.sslpDeposited.plus(amount)
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

  const topDogContract = TopDogContract.bind(SHIBASWAP_TOPDOG_ADDRESS)

  const poolInfo = topDogContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid, event.block)

  const poolHistory = getPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(SHIBASWAP_TOPDOG_ADDRESS)
  pool.lastRewardBlock = poolInfo.value2
  pool.accBonePerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const poolAge = pool.sslpAge.plus(poolDays.times(pool.sslpBalance))
  const poolAgeRemoved = poolAge.div(pool.sslpBalance).times(amount)
  pool.sslpAge = poolAge.minus(poolAgeRemoved)
  pool.sslpAgeRemoved = pool.sslpAgeRemoved.plus(poolAgeRemoved)
  pool.sslpWithdrawn = pool.sslpWithdrawn.plus(amount)
  pool.sslpBalance = pool.sslpBalance.minus(amount)
  pool.updatedAt = event.block.timestamp

  const user = getUser(event.params.pid, event.params.user, event.block)

  if (event.block.number.gt(SHIBASWAP_TOPDOG_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accBonePerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    // log.info('Withdraw: User amount is more than zero, we should harvest {} bone - block: {}', [
    //   pending.toString(),
    //   event.block.number.toString(),
    // ])
    // log.info('BONE PRICE {}', [getBonePrice(event.block).toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      // log.info('Harvesting {} BONE (CURRENT BONE PRICE {})', [
      //   pending.toString(),
      //   getBonePrice(event.block).toString(),
      // ])
      const boneHarvestedUSD = pending.times(getBonePrice(event.block))
      user.boneHarvested = user.boneHarvested.plus(pending)
      user.boneHarvestedUSD = user.boneHarvestedUSD.plus(boneHarvestedUSD)
      pool.boneHarvested = pool.boneHarvested.plus(pending)
      pool.boneHarvestedUSD = pool.boneHarvestedUSD.plus(boneHarvestedUSD)
      poolHistory.boneHarvested = pool.boneHarvested
      poolHistory.boneHarvestedUSD = pool.boneHarvestedUSD
    }
  }

  const userInfo = topDogContract.userInfo(event.params.pid, event.params.user)

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

  const topDpg = getTopDog(event.block)

  const days = event.block.timestamp.minus(topDpg.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const slpAge = topDpg.sslpAge.plus(days.times(topDpg.sslpBalance))
  const slpAgeRemoved = slpAge.div(topDpg.sslpBalance).times(amount)
  topDpg.sslpAge = slpAge.minus(slpAgeRemoved)
  topDpg.sslpAgeRemoved = topDpg.sslpAgeRemoved.plus(slpAgeRemoved)

  topDpg.sslpWithdrawn = topDpg.sslpWithdrawn.plus(amount)
  topDpg.sslpBalance = topDpg.sslpBalance.minus(amount)
  topDpg.updatedAt = event.block.timestamp
  topDpg.save()

  const history = getHistory(SHIBASWAP_TOPDOG_ADDRESS.toHex(), event.block)
  history.sslpAge = topDpg.sslpAge
  history.sslpAgeRemoved = history.sslpAgeRemoved.plus(slpAgeRemoved)
  history.sslpBalance = topDpg.sslpBalance
  history.sslpWithdrawn = history.sslpWithdrawn.plus(amount)
  history.save()

  poolHistory.sslpAge = pool.sslpAge
  poolHistory.sslpAgeRemoved = poolHistory.sslpAgeRemoved.plus(slpAgeRemoved)
  poolHistory.sslpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.sslpWithdrawn = poolHistory.sslpWithdrawn.plus(amount)
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
  pool.balance = pairContract.balanceOf(SHIBASWAP_TOPDOG_ADDRESS)
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

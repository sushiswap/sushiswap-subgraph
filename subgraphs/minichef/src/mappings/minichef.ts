import {
  Deposit,
  Withdraw,
  EmergencyWithdraw,
  Harvest,
  LogPoolAddition,
  LogSetPool,
  LogUpdatePool,
  LogSushiPerSecond,
  MiniChef as MiniChefContract
} from '../../generated/MiniChef/MiniChef'

import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E12,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  MINI_CHEF_ADDRESS,
  ACC_SUSHI_PRECISION
} from 'const'
import { MiniChef, Pool, User } from '../../generated/schema'

import {
  getMiniChef,
  getPool,
  getUser,
  getRewarder
} from '../entities'

import { ERC20 as ERC20Contract } from '../../generated/MiniChef/ERC20'

export function logPoolAddition(event: LogPoolAddition): void {
  log.info('[MiniChef] Log Pool Addition {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.lpToken.toHex(),
    event.params.rewarder.toHex()
  ])

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const rewarder = getRewarder(event.params.rewarder, event.block)

  pool.pair = event.params.lpToken
  pool.rewarder = rewarder.id
  pool.allocPoint = event.params.allocPoint
  pool.save()

  miniChef.totalAllocPoint = miniChef.totalAllocPoint.plus(pool.allocPoint)
  miniChef.poolCount = miniChef.poolCount.plus(BIG_INT_ONE)
  miniChef.save()
}

export function logSetPool(event: LogSetPool): void {
  log.info('[MiniChef] Log Set Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.rewarder.toHex(),
    event.params.overwrite == true ? 'true' : 'false'
  ])

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)

  if (event.params.overwrite == true) {
     const rewarder = getRewarder(event.params.rewarder, event.block)
     pool.rewarder = rewarder.id
  }
  pool.allocPoint = event.params.allocPoint
  pool.save()

  miniChef.totalAllocPoint = miniChef.totalAllocPoint.plus(event.params.allocPoint.minus(pool.allocPoint))
  miniChef.save()
}

export function logUpdatePool(event: LogUpdatePool): void {
  log.info('[MiniChef] Log Update Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.lastRewardTime.toString(), //uint64, I think this is Decimal but not sure
    event.params.lpSupply.toString(),
    event.params.accSushiPerShare.toString()
  ])

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)

  //pool.slpBalance = event.params.lpSupply
  pool.accSushiPerShare = event.params.accSushiPerShare
  pool.lastRewardTime = event.params.lastRewardTime
  pool.save()
}

export function logSushiPerSecond(event: LogSushiPerSecond): void {
  log.info('[MiniChef] Log Sushi Per Second {}', [
    event.params.sushiPerSecond.toString()
  ])

  const miniChef = getMiniChef(event.block)

  miniChef.sushiPerSecond = event.params.sushiPerSecond
  miniChef.save()
}

export function deposit(event: Deposit): void {
  log.info('[MiniChef] Log Deposit {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.to, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.plus(event.params.amount)
  pool.save()

  user.amount = user.amount.plus(event.params.amount)
  user.rewardDebt = user.rewardDebt.plus(event.params.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION))
  user.save()
}

export function withdraw(event: Withdraw): void {
  log.info('[MiniChef] Log Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.minus(event.params.amount)
  pool.save()

  user.amount = user.amount.minus(event.params.amount)
  user.rewardDebt = user.rewardDebt.minus(event.params.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION))
  user.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('[MiniChef] Log Emergency Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const miniChef = getMiniChef(event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  user.amount = BIG_INT_ZERO
  user.rewardDebt = BIG_INT_ZERO
  user.save()
}

export function harvest(event: Harvest): void {
  log.info('[MiniChef] Log Withdraw {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString()
  ])

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  let accumulatedSushi = user.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION)

  user.rewardDebt = accumulatedSushi
  user.sushiHarvested = user.sushiHarvested.plus(event.params.amount)
  user.save()
}

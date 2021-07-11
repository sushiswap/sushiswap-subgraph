import {
  Deposit,
  Withdraw,
  EmergencyWithdraw,
  Harvest,
  LogPoolAddition,
  LogSetPool,
  LogUpdatePool
} from '../../generated/MasterChefV2/MasterChefV2'

import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E12,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  MASTER_CHEF_V2_ADDRESS,
  ACC_SUSHI_PRECISION
} from 'const'
import { MasterChef, Pool, User, Rewarder } from '../../generated/schema'

import {
  getMasterChef,
  getPool,
  getRewarder,
  getUser,
  updateRewarder
} from '../entities'

import { ERC20 as ERC20Contract } from '../../generated/MasterChefV2/ERC20'

export function logPoolAddition(event: LogPoolAddition): void {
  log.info('[MasterChefV2] Log Pool Addition {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.lpToken.toHex(),
    event.params.rewarder.toHex()
  ])

  const masterChef = getMasterChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const rewarder = getRewarder(event.params.rewarder, event.block)

  pool.pair = event.params.lpToken
  pool.rewarder = rewarder.id
  pool.allocPoint = event.params.allocPoint
  pool.save()

  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(pool.allocPoint)
  masterChef.poolCount = masterChef.poolCount.plus(BIG_INT_ONE)
  masterChef.save()
}

export function logSetPool(event: LogSetPool): void {
  log.info('[MasterChefV2] Log Set Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.rewarder.toHex(),
    event.params.overwrite == true ? 'true' : 'false'
  ])

  const masterChef = getMasterChef(event.block)
  const pool = getPool(event.params.pid, event.block)

  if (event.params.overwrite == true) {
     const rewarder = getRewarder(event.params.rewarder, event.block)
     pool.rewarder = rewarder.id
  }

  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(event.params.allocPoint.minus(pool.allocPoint))
  masterChef.save()

  pool.allocPoint = event.params.allocPoint
  pool.save()
}

export function logUpdatePool(event: LogUpdatePool): void {
  log.info('[MasterChefV2] Log Update Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.lastRewardBlock.toString(),
    event.params.lpSupply.toString(),
    event.params.accSushiPerShare.toString()
  ])

  const masterChef = getMasterChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  updateRewarder(Address.fromString(pool.rewarder))

  pool.accSushiPerShare = event.params.accSushiPerShare
  pool.lastRewardBlock = event.params.lastRewardBlock
  pool.save()
}

export function deposit(event: Deposit): void {
  log.info('[MasterChefV2] Log Deposit {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const masterChef = getMasterChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.to, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.plus(event.params.amount)
  pool.save()

  user.amount = user.amount.plus(event.params.amount)
  user.rewardDebt = user.rewardDebt.plus(event.params.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION))
  user.save()
}

export function withdraw(event: Withdraw): void {
  log.info('[MasterChefV2] Log Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const masterChef = getMasterChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.minus(event.params.amount)
  pool.save()

  user.amount = user.amount.minus(event.params.amount)
  user.rewardDebt = user.rewardDebt.minus(event.params.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION))
  user.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('[MasterChefV2] Log Emergency Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const masterChefV2 = getMasterChef(event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  user.amount = BIG_INT_ZERO
  user.rewardDebt = BIG_INT_ZERO
  user.save()
}

export function harvest(event: Harvest): void {
  log.info('[MasterChefV2] Log Withdraw {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString()
  ])

  const masterChef = getMasterChef(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  let accumulatedSushi = user.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION)

  user.rewardDebt = accumulatedSushi
  user.sushiHarvested = user.sushiHarvested.plus(event.params.amount)
  user.save()
}

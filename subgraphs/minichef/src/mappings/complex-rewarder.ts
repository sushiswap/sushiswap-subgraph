import { Address, BigInt, log } from '@graphprotocol/graph-ts'

import {
  LogRewardPerSecond,
  LogPoolAddition,
  LogSetPool
} from '../../generated/templates/ComplexRewarderTime/ComplexRewarderTime'
import { getRewarder, getNativeRewardPool } from '../entities'

export function logRewardPerSecond(event: LogRewardPerSecond): void {
  log.info('[MiniChef:NativeRewarder] Log Reward Per Second {}', [
    event.params.rewardPerSecond.toString()
  ])

  const rewarder = getRewarder(event.address, event.block)
  rewarder.rewardPerSecond = event.params.rewardPerSecond
  rewarder.save()
}

export function logPoolAddition(event: LogPoolAddition): void {
  log.info('[MiniChef:NativeRewarder] Log Pool Addition {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString()
  ])

  const rewarder = getRewarder(event.address, event.block)
  const rewarderPool = getNativeRewardPool(event.params.pid, rewarder)

  rewarderPool.allocPoint = event.params.allocPoint
  rewarder.totalAllocPoint = rewarder.totalAllocPoint.plus(event.params.allocPoint)
  rewarder.save()
  rewarderPool.save()
}

export function logSetPool(event: LogSetPool): void {
  log.info('[MiniChef:NativeRewarder] Log Set Pool {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString()
  ])

  const rewarder = getRewarder(event.address, event.block)
  const rewarderPool = getNativeRewardPool(event.params.pid, rewarder)

  rewarder.totalAllocPoint = rewarder.totalAllocPoint.plus(event.params.allocPoint.minus(rewarderPool.allocPoint))
  rewarderPool.allocPoint = event.params.allocPoint
  rewarder.save()
  rewarderPool.save()
}

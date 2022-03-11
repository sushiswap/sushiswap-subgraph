import { LogRewardPerSecond, LogPoolAddition, LogSetPool } from '../../generated/MiniChef/CloneRewarderTime'
import { getRewarder, getNativeRewarderPool } from '../entities'
import { log } from '@graphprotocol/graph-ts'

export function logRewardPerSecond(event: LogRewardPerSecond): void {
  //log.info('[MiniChef:Rewarder] Log Reward Per Second {}', [event.params.rewardPerSecond.toString()])
  const rewarder = getRewarder(event.address, event.block)
  rewarder.rewardPerSecond = event.params.rewardPerSecond
  rewarder.save()
}

export function logPoolAddition(event: LogPoolAddition): void {
  const rewarder = getRewarder(event.address, event.block)
  const pool = getNativeRewarderPool(event.params.pid)

  pool.allocPoint = event.params.allocPoint
  pool.save()

  rewarder.totalAllocPoint = rewarder.totalAllocPoint.plus(pool.allocPoint)
  rewarder.save()
}

export function logSetPool(event: LogSetPool): void {
  const rewarder = getRewarder(event.address, event.block)
  const pool = getNativeRewarderPool(event.params.pid)

  rewarder.totalAllocPoint = rewarder.totalAllocPoint.plus(event.params.allocPoint.minus(pool.allocPoint))
  rewarder.save()
  pool.allocPoint = event.params.allocPoint
  pool.save()
}

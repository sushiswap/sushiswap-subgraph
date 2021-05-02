import { LogRewardPerSecond } from '../../generated/templates/ComplexRewarderTime/ComplexRewarderTime'
import { getRewarder } from '../entities'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'

export function logRewardPerSecond(event: LogRewardPerSecond): void {
  log.info('[MiniChef:Rewarder] Log Reward Per Second {}', [
    event.params.rewardPerSecond.toString()
  ])

  const rewarder = getRewarder(event.address, event.block)
  rewarder.rewardPerSecond = event.params.rewardPerSecond
  rewarder.save()
}

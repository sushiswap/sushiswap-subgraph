import { Address, BigInt, log } from '@graphprotocol/graph-ts'

import { LogRewardPerSecond } from '../../generated/templates/CloneRewarderTime/CloneRewarderTime'
import { getRewarder } from '../entities'

export function logRewardPerSecond(event: LogRewardPerSecond): void {
  log.info('[MasterChefV2:Rewarder] Log Reward Per Second {}', [
    event.params.rewardPerSecond.toString()
  ])

  const rewarder = getRewarder(event.address, event.block)
  rewarder.rewardPerSecond = event.params.rewardPerSecond
  rewarder.save()
}

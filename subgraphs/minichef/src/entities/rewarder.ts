import { ADDRESS_ZERO, BIG_INT_ZERO, COMPLEX_REWARDER, NATIVE } from 'const'
import { Address, ethereum } from '@graphprotocol/graph-ts'
import {
  CloneRewarderTime as CloneRewarderTimeTemplate,
  ComplexRewarderTime as ComplexRewarderTimeTemplate,
} from '../../generated/templates'

import { CloneRewarderTime as CloneRewarderTimeContract } from '../../generated/MiniChef/CloneRewarderTime'
import { Rewarder } from '../../generated/schema'

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
  let rewarder = Rewarder.load(address.toHex())

  if (rewarder === null) {
    rewarder = new Rewarder(address.toHex())

    if (address == ADDRESS_ZERO) {
      rewarder.rewardToken = ADDRESS_ZERO
      rewarder.rewardPerSecond = BIG_INT_ZERO
      rewarder.timestamp = block.timestamp
      rewarder.block = block.number
      rewarder.save()
    }

    if (COMPLEX_REWARDER != ADDRESS_ZERO && address == COMPLEX_REWARDER) {
      rewarder.timestamp = block.timestamp
      rewarder.block = block.number
      rewarder.rewardToken = NATIVE
      rewarder.rewardPerSecond = BIG_INT_ZERO
      rewarder.save()
      ComplexRewarderTimeTemplate.create(address)
    } else if (address != ADDRESS_ZERO) {
      const rewarderContract = CloneRewarderTimeContract.bind(address)
      const rewardTokenResult = rewarderContract.try_rewardToken()
      const rewardRateResult = rewarderContract.try_rewardPerSecond()
      if (!rewardTokenResult.reverted) {
        rewarder.rewardToken = rewardTokenResult.value
      }
      if (!rewardRateResult.reverted) {
        rewarder.rewardPerSecond = rewardRateResult.value
      }
      rewarder.timestamp = block.timestamp
      rewarder.block = block.number
      rewarder.save()
      CloneRewarderTimeTemplate.create(address)
    }
  }

  return rewarder as Rewarder
}

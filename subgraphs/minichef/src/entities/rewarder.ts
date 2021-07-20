import { ADDRESS_ZERO, BIG_INT_ZERO, COMPLEX_REWARDER, NATIVE } from "const"
import { Address, ethereum } from "@graphprotocol/graph-ts"

import { ComplexRewarderTime as ComplexRewarderTemplate } from "../../generated/templates"
import { CloneRewarderTime as CloneRewarderTemplate } from "../../generated/templates"
import { CloneRewarderTime as CloneRewarderContract } from "../../generated/templates/CloneRewarderTime/CloneRewarderTime"
import { Rewarder } from "../../generated/schema"

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
  let rewarder = Rewarder.load(address.toHex())

  if (rewarder === null) {
    rewarder = new Rewarder(address.toHex())
    rewarder.rewardToken = ADDRESS_ZERO
    rewarder.rewardPerSecond = BIG_INT_ZERO

    if (address == COMPLEX_REWARDER) {
      rewarder.rewardPerSecond = BIG_INT_ZERO
      rewarder.rewardToken = NATIVE
      ComplexRewarderTemplate.create(address)
    }
    else {
      const rewarderContract = CloneRewarderContract.bind(address)
      let rewardTokenResult = rewarderContract.try_rewardToken()
      let rewardRateResult = rewarderContract.try_rewardPerSecond()

      if (!rewardTokenResult.reverted) {
        rewarder.rewardToken = rewardTokenResult.value
      }
      if (!rewardRateResult.reverted) {
        rewarder.rewardPerSecond = rewardRateResult.value
        CloneRewarderTemplate.create(address)
      }
    }

  }

  rewarder.timestamp = block.timestamp
  rewarder.block = block.number
  rewarder.save()

  return rewarder as Rewarder
}

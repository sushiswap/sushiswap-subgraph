import {
  ADDRESS_ZERO,
  BIG_INT_ZERO,
  //MATIC_COMPLEX_REWARDER,
  //WMATIVE_ADDRESS
} from 'const'
import { Address, ethereum } from '@graphprotocol/graph-ts'

import { ComplexRewarderTime as ComplexRewarderTemplate } from '../../generated/templates'
import {
  ConvexRewarder as ConvexRewarderContract,

}
import { Rewarder } from '../../generated/schema'

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
  let rewarder = Rewarder.load(address.toHex())

  if (rewarder === null) {
    rewarder = new Rewarder(address.toHex())
    rewarder.rewardToken = ADDRESS_ZERO
    rewarder.rewardPerSecond = BIG_INT_ZERO
  }

  rewarder.timestamp = block.timestamp
  rewarder.block = block.number
  rewarder.save()

  return rewarder as Rewarder
}

export function updateRewarder(address: Address, block: ethereum.Block): void {
  let rewarder = Rewarder.load(address.toHex())

  // rewarders that need to be updated through contract calls
  if (address in CONVEX_REWARDERS) {
    const rewarderContract = ConvexRewarderContract.bind(address)

  }
}

export function updateRewarder()

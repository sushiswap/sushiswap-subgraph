import {
  ADDRESS_ZERO,
  BIG_INT_ZERO,
  CONVEX_REWARDERS,
  ALCX_REWARDER
} from 'const'
import { Address, ethereum } from '@graphprotocol/graph-ts'

import { ComplexRewarder as ComplexRewarderContract } from '../../generated/MasterChefV2/ComplexRewarder'
import { ConvexRewarder as ConvexRewarderContract } from '../../generated/MasterChefV2/ConvexRewarder'
import { Rewarder } from '../../generated/schema'

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
  let rewarder = Rewarder.load(address.toHex())

  if (rewarder === null) {
    rewarder = new Rewarder(address.toHex())
    rewarder.rewardToken = ADDRESS_ZERO
    rewarder.rewardPerBlock = BIG_INT_ZERO

    // rewarders that need token to be hardcoded
    if (CONVEX_REWARDERS.includes(address)) {
      rewarder.rewardToken = Address.fromString('0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b')
    }
    if (address == ALCX_REWARDER) {
      rewarder.rewardToken = Address.fromString('0xdbdb4d16eda451d0503b854cf79d55697f90c8df')
    }
  }

  rewarder.timestamp = block.timestamp
  rewarder.block = block.number
  rewarder.save()

  updateRewarder(address)

  return rewarder as Rewarder
}

export function updateRewarder(address: Address): void {
  let rewarder = Rewarder.load(address.toHex())

  // rewarders that need to be updated through contract calls
  if (CONVEX_REWARDERS.includes(address)) {
    const rewarderContract = ConvexRewarderContract.bind(address)
    let rewardRate = rewarderContract.rewardRate()
    rewarder.rewardPerBlock = rewardRate
  }
  if (address == ALCX_REWARDER) {
    const rewarderContract = ComplexRewarderContract.bind(address)
    let rewardRate = rewarderContract.tokenPerBlock()
    rewarder.rewardPerBlock = rewardRate
  }

  rewarder.save()
}

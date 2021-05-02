import { Rewarder } from '../../generated/schema'
import { ComplexRewarderTime as ComplexRewarderTemplate } from '../../generated/templates'
import { ComplexRewarderTime as ComplexRewarderContract } from '../../generated/templates/ComplexRewarderTime/ComplexRewarderTime'
import { BigInt, Address, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_INT_ZERO,
  ADDRESS_ZERO,
  MATIC_COMPLEX_REWARDER,
  WMATIC_ADDRESS
} from 'const'

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
  let rewarder = Rewarder.load(address.toHex())

  if (rewarder === null) {
    rewarder = new Rewarder(address.toHex())
    rewarder.rewardToken = ADDRESS_ZERO
    rewarder.rewardPerSecond = BIG_INT_ZERO

    if (address == MATIC_COMPLEX_REWARDER) {
        rewarder.rewardPerSecond = BIG_INT_ZERO
        rewarder.rewardToken = WMATIC_ADDRESS
        ComplexRewarderTemplate.create(address)
    }
  }

  rewarder.timestamp = block.timestamp
  rewarder.block = block.number
  rewarder.save()

  return rewarder as Rewarder
}

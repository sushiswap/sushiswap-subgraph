import { KashiPairAction } from '../../generated/schema'
import { Address, ethereum } from '@graphprotocol/graph-ts'
import { getKashiPair } from './kashi-pair'
import { BIG_INT_ZERO } from 'const'

import {
  BIG_INT_ZERO,
  PAIR_ADD_COLLATERAL,
  PAIR_REMOVE_COLLATERAL,
  PAIR_ADD_ASSET,
  PAIR_REMOVE_ASSET,
  PAIR_BORROW,
  PAIR_REPAY,
} from 'const'

export function createKashiPairAction(event: ethereum.Event, type: string): KashiPairAction {
  const id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()

  const kashiPair = getKashiPair(event.address, event.block)

  const action = new KashiPairAction(id)

  if (type == PAIR_ADD_COLLATERAL) {
    action.root = getRootId(event.parameters[1].value.toAddress(), event.address)
    action.share = event.parameters[2].value.toBigInt()
    action.token = kashiPair.collateral
  } else if (type == PAIR_REMOVE_COLLATERAL) {
    action.root = getRootId(event.parameters[0].value.toAddress(), event.address)
    action.share = event.parameters[2].value.toBigInt()
    action.token = kashiPair.collateral
  } else if (type == PAIR_ADD_ASSET) {
    action.root = getRootId(event.parameters[1].value.toAddress(), event.address)
    action.share = event.parameters[2].value.toBigInt()
    action.fraction = event.parameters[3].value.toBigInt()
    action.token = kashiPair.asset
  } else if (type == PAIR_REMOVE_ASSET) {
    action.root = getRootId(event.parameters[0].value.toAddress(), event.address)
    action.share = event.parameters[2].value.toBigInt()
    action.fraction = event.parameters[3].value.toBigInt()
    action.token = kashiPair.asset
  } else if (type == PAIR_BORROW) {
    action.root = getRootId(event.parameters[0].value.toAddress(), event.address)
    action.amount = event.parameters[2].value.toBigInt()
    action.feeAmount = event.parameters[3].value.toBigInt()
    action.part = event.parameters[4].value.toBigInt()
    action.token = kashiPair.asset
  } else if (type == PAIR_REPAY) {
    action.root = getRootId(event.parameters[1].value.toAddress(), event.address)
    action.amount = event.parameters[2].value.toBigInt()
    action.part = event.parameters[3].value.toBigInt()
    action.token = kashiPair.asset
  }

  action.type = type
  action.pair = event.address.toHex()
  action.block = event.block.number
  action.timestamp = event.block.timestamp

  return action as KashiPairAction
}

function getRootId(user: Address, pair: Address): string {
  return user.toHex().concat('-').concat(pair.toHex())
}

import { BentoBoxAction } from '../../generated/schema'
import { ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from 'const'

export function createBentoBoxAction(event: ethereum.Event, type: string): BentoBoxAction {
  const id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()

  const token = event.parameters[0].value.toAddress()
  const from = event.parameters[1].value.toAddress()
  const to = event.parameters[2].value.toAddress()
  const amount = event.parameters[3].value.toBigInt()
  const share = event.parameters.length == 5 ? event.parameters[4].value.toBigInt() : BIG_INT_ZERO

  const action = new BentoBoxAction(id)

  action.bentoBox = event.address.toHex()
  action.type = type
  action.from = from.toHex()
  action.to = to.toHex()
  action.token = token.toHex()
  action.amount = event.parameters.length == 4 ? BIG_INT_ZERO : amount  // LogTransfer has 4 parameters, rest have 5
  action.share = event.parameters.length == 4 ? amount : share
  action.block = event.block.number
  action.timestamp = event.block.timestamp

  action.save()

  return action as BentoBoxAction
}

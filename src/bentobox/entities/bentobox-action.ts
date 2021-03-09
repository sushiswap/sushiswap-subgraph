import { BentoBoxAction } from '../../../generated/schema'
import { ethereum } from '@graphprotocol/graph-ts'

export function createBentoBoxAction(event: ethereum.Event, type: string): BentoBoxAction {
  const id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()

  const token = event.parameters[0].value.toAddress()
  const from = event.parameters[1].value.toAddress()
  const to = event.parameters[2].value.toAddress()
  const amount = event.parameters[3].value.toBigInt()

  const action = new BentoBoxAction(id)

  action.type = type
  action.bentoBox = event.address.toHex()
  action.from = from.toHex()
  action.to = to.toHex()
  action.token = token.toHex()
  action.amount = amount
  action.block = event.block.number
  action.timestamp = event.block.timestamp

  action.save()

  return action as BentoBoxAction
}

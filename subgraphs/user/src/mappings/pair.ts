import {
  Transfer as TransferEvent,
} from '../../generated/templates/Pair/Pair'
import {
  getUser,
} from '../entities'

export function onTransfer(event: TransferEvent): void {
  getUser(event.params.from, event.block)
  getUser(event.params.to, event.block)
}

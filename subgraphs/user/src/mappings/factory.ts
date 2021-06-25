import { PairCreated } from '../../generated/Factory/Factory'
import { Pair as PairTemplate } from '../../generated/templates'
import { getUser } from '../entities'

export function onPairCreated(event: PairCreated): void {
  getUser(event.transaction.from, event.block)
  // create the tracked contract based on the template
  PairTemplate.create(event.params.pair)
}

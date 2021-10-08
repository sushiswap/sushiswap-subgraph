import { getFactory, getPair } from '../enitites'

import { BIG_INT_ONE } from 'const'
import { PairCreated } from '../../generated/Factory/Factory'
import { Pair as PairTemplate } from '../../generated/templates'

export function onPairCreated(event: PairCreated): void {
  const factory = getFactory()

  const pair = getPair(event.params.pair, event.block, event.params.token0, event.params.token1)

  // We returned null for some reason, we should silently bail without creating this pair
  if (!pair) {
    return
  }

  // Now it's safe to save
  pair.save()

  // create the tracked contract based on the template
  PairTemplate.create(event.params.pair)

  // Update pair count once we've sucessesfully created a pair
  factory.pairCount = factory.pairCount.plus(BIG_INT_ONE)
  factory.save()
}

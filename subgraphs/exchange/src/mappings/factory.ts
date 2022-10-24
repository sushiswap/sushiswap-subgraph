import { getFactory, getPair } from '../enitites'

import { BIG_INT_ONE, USDC_WETH_PAIR, USDT_WETH_PAIR, NETWORK } from 'const'
import { Address, log } from '@graphprotocol/graph-ts'
import { PairCreated } from '../../generated/Factory/Factory'
import { Pair as PairTemplate } from '../../generated/templates'
import { Pair } from '../../generated/schema'

export function onPairCreated(event: PairCreated): void {
  const factory = getFactory()
  /**
   * Note. The following condition is only for the Aurora network for main pairs.
   * Because the current subgraph is created and subscribes to listen for the events
   * of the pairs that were created in the selected factory with the special event of the created pair.
   * In the Aurora network at the Trisolaris factory, thegraph cannot find this event,
   * it can no longer be subscribed to, we have created a condition for creating and
   * subscribing to the USDC and USDT pair if it has not been created before."
   */
  if (NETWORK === 'aurora') {
    let usdcPair = Pair.load(USDC_WETH_PAIR)
    let usdtPair = Pair.load(USDT_WETH_PAIR)

    if (usdcPair === null) {
      usdcPair = getPair(Address.fromString(USDC_WETH_PAIR), event.block)
      log.warning("USDC save", [])
      usdcPair.save()
      PairTemplate.create(Address.fromString(USDC_WETH_PAIR))
      factory.pairCount = factory.pairCount.plus(BIG_INT_ONE)
    }
    if (usdtPair === null) {
      usdtPair = getPair(Address.fromString(USDT_WETH_PAIR), event.block)
      log.warning("USDT save", [])
      usdtPair.save()
      PairTemplate.create(Address.fromString(USDT_WETH_PAIR))
      factory.pairCount = factory.pairCount.plus(BIG_INT_ONE)
    }
  }

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

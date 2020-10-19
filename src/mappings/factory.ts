import {
  ONE_BIG_INT,
  ZERO_BIG_DECIMAL,
  ZERO_BIG_INT
} from '../constants'
import { getFactory, getToken } from '../entities'

import { Pair } from '../../generated/schema'
import { PairCreated } from '../../generated/Factory/Factory'
import { Pair as PairTemplate } from '../../generated/templates'
import { log } from '@graphprotocol/graph-ts'

export function onPairCreated(event: PairCreated): void {

  const factory = getFactory()
  factory.pairCount = factory.pairCount.plus(ONE_BIG_INT)
  factory.save()

  const token0 = getToken(event.params.token0)
  const token1 = getToken(event.params.token1)

  log.info('pair created {} block {}', [token0.symbol.concat('-').concat(token1.symbol), event.block.number.toString()])

  if (!token0 || !token1) {
    log.debug('onPairCreated no token0 or no token1', [])
    return
  }

  const pair = new Pair(event.params.pair.toHex()) as Pair
  pair.factory = factory.id
  pair.name = token0.symbol.concat('-').concat(token1.symbol)

  pair.token0 = token0.id
  pair.token1 = token1.id
  pair.liquidityProviderCount = ZERO_BIG_INT

  pair.txCount = ZERO_BIG_INT
  pair.reserve0 = ZERO_BIG_DECIMAL
  pair.reserve1 = ZERO_BIG_DECIMAL
  pair.trackedReserveETH = ZERO_BIG_DECIMAL
  pair.reserveETH = ZERO_BIG_DECIMAL
  pair.reserveUSD = ZERO_BIG_DECIMAL
  pair.totalSupply = ZERO_BIG_DECIMAL
  pair.volumeToken0 = ZERO_BIG_DECIMAL
  pair.volumeToken1 = ZERO_BIG_DECIMAL
  pair.volumeUSD = ZERO_BIG_DECIMAL
  pair.untrackedVolumeUSD = ZERO_BIG_DECIMAL
  pair.token0Price = ZERO_BIG_DECIMAL
  pair.token1Price = ZERO_BIG_DECIMAL

  pair.createdAtTimestamp = event.block.timestamp
  pair.createdAtBlockNumber = event.block.number

  // create the tracked contract based on the template
  PairTemplate.create(event.params.pair)

  pair.save()
}

import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Pair, PairDayData } from '../../generated/schema'

import { BIG_DECIMAL_ZERO } from 'const'

export function updatePairDayData(event: ethereum.Event): PairDayData {
  const timestamp = event.block.timestamp.toI32()

  const day = timestamp / 86400

  const date = day * 86400

  const id = event.address.toHex().concat('-').concat(BigInt.fromI32(day).toString())

  const pair = Pair.load(event.address.toHex())

  let pairDayData = PairDayData.load(id)

  if (pairDayData === null) {
    pairDayData = new PairDayData(id)
    pairDayData.date = date
    pairDayData.token0 = pair.token0
    pairDayData.token1 = pair.token1
    pairDayData.pair = pair.id
    pairDayData.volumeToken0 = BIG_DECIMAL_ZERO
    pairDayData.volumeToken1 = BIG_DECIMAL_ZERO
    pairDayData.volumeUSD = BIG_DECIMAL_ZERO
    pairDayData.txCount = BigInt.fromI32(0)
  }

  pairDayData.totalSupply = pair.totalSupply
  pairDayData.reserve0 = pair.reserve0
  pairDayData.reserve1 = pair.reserve1
  pairDayData.reserveUSD = pair.reserveUSD
  pairDayData.txCount = pairDayData.txCount.plus(BigInt.fromI32(1))
  pairDayData.save()

  return pairDayData as PairDayData
}

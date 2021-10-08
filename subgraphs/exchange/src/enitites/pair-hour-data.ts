import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Pair, PairHourData } from '../../generated/schema'

import { BIG_DECIMAL_ZERO } from 'const'

export function updatePairHourData(event: ethereum.Event): PairHourData {
  const timestamp = event.block.timestamp.toI32()

  const hour = timestamp / 3600

  const date = hour * 3600

  const id = event.address.toHex().concat('-').concat(BigInt.fromI32(hour).toString())

  const pair = Pair.load(event.address.toHex())

  let pairHourData = PairHourData.load(id)

  if (pairHourData === null) {
    pairHourData = new PairHourData(id)
    pairHourData.date = date
    pairHourData.pair = pair.id
    pairHourData.volumeToken0 = BIG_DECIMAL_ZERO
    pairHourData.volumeToken1 = BIG_DECIMAL_ZERO
    pairHourData.volumeUSD = BIG_DECIMAL_ZERO
    pairHourData.txCount = BigInt.fromI32(0)
  }

  pairHourData.reserve0 = pair.reserve0
  pairHourData.reserve1 = pair.reserve1
  pairHourData.reserveUSD = pair.reserveUSD
  pairHourData.txCount = pairHourData.txCount.plus(BigInt.fromI32(1))

  pairHourData.save()

  return pairHourData as PairHourData
}

import { BigInt, ethereum } from '@graphprotocol/graph-ts'
import { DayData, Factory } from '../../generated/schema'
import { FACTORY_ADDRESS, ZERO_BIG_DECIMAL, ZERO_BIG_INT } from '../constants'

export function getFactory(): Factory {
  let factory = Factory.load(FACTORY_ADDRESS)

  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS)
    factory.volumeETH = ZERO_BIG_DECIMAL
    factory.volumeUSD = ZERO_BIG_DECIMAL
    factory.untrackedVolumeUSD = ZERO_BIG_DECIMAL
    factory.liquidityETH = ZERO_BIG_DECIMAL
    factory.liquidityUSD = ZERO_BIG_DECIMAL
    factory.pairCount = ZERO_BIG_INT
    factory.txCount = ZERO_BIG_INT
    factory.tokenCount = ZERO_BIG_INT
    factory.userCount = ZERO_BIG_INT
    factory.save()
  }

  return factory as Factory
}

export function getDayData(event: ethereum.Event): DayData {
  const id = event.block.timestamp.toI32() / 86400

  let dayData = DayData.load(id.toString())

  if (dayData === null) {
    const factory = getFactory()
    dayData = new DayData(id.toString())
    dayData.factory = factory.id
    dayData.date = id * 86400
    dayData.volumeUSD = ZERO_BIG_DECIMAL
    dayData.volumeETH = ZERO_BIG_DECIMAL
    dayData.untrackedVolume = ZERO_BIG_DECIMAL
    dayData.liquidityUSD = factory.liquidityUSD
    dayData.liquidityETH = factory.liquidityETH
    dayData.txCount = factory.txCount
  }

  return dayData as DayData
}

export function updateDayData(event: ethereum.Event): DayData {
  const factory = getFactory()

  const dayData = getDayData(event)

  // TODO: Anything else we need here?
  dayData.liquidityUSD = factory.liquidityUSD
  dayData.liquidityETH = factory.liquidityETH
  dayData.txCount = factory.txCount

  dayData.save()

  return dayData as DayData
}

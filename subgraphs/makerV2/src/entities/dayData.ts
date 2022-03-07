import { DayData } from '../../generated/schema'
import { Address, ethereum, dataSource, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO } from 'const'

export function getDayData(event: ethereum.Event): DayData {
  const id = event.block.timestamp.toI32() / 86400

  let dayData = DayData.load(id.toString())

  if (dayData === null) {
    dayData = new DayData(id.toString())
    dayData.date = id * 86400
    dayData.servingsCount = BIG_DECIMAL_ZERO
    dayData.amountSushi = BIG_INT_ZERO
  }

  return dayData as DayData
}

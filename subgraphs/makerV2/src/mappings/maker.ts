import { Address, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ONE } from 'const'
import { getMaker, getDayData } from '../entities'
import { DayData, Serving } from '../../generated/schema'
import { Serve } from '../../generated/SushiMaker/SushiMakerV2'


export function handleServe(event: Serve): void {
  log.info('[SushiMakerV2] Log Serve {}', [event.params.amount.toString()])

  const maker = getMaker(event.block)

  const id = event.block.timestamp
  let serving = new Serving(id.toString())

  serving.maker = maker.id
  serving.tx = event.transaction.hash
  serving.amountSushi = event.params.amount
  serving.block = event.block.number
  serving.timestamp = event.block.timestamp
  serving.save()

  let dayData = getDayData(event)

  dayData.servingsCount += BIG_DECIMAL_ONE
  dayData.amountSushi += event.params.amount
  dayData.save()


  maker.sushiServed += event.params.amount
  maker.totalServings += BIG_DECIMAL_ONE
  maker.save()
}

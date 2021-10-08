import { Maker } from '../../generated/schema'
import { Address, ethereum , dataSource, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO } from 'const'


export function getMaker(block: ethereum.Block): Maker {
  let maker = Maker.load(dataSource.address().toHex())

  if (maker === null) {
    maker = new Maker(dataSource.address().toHex())
    maker.sushiServed = BIG_INT_ZERO
    maker.totalServings = BIG_DECIMAL_ZERO
  }

  maker.timestamp = block.timestamp
  maker.block = block.number
  maker.save()

  return maker as Maker
}

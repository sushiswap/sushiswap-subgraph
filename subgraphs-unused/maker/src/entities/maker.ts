import { Address, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, SUSHI_MAKER_ADDRESS } from '../../../../packages/constants'
import { Maker } from '../generated/schema'


export function getMaker(): Maker {
  const id = SUSHI_MAKER_ADDRESS.toHex()
  let maker = Maker.load(id)

  if (maker === null) {
    maker = new Maker(id)
    maker.sushiServed = BIG_DECIMAL_ZERO
    maker.save()
  }

  return maker as Maker
}

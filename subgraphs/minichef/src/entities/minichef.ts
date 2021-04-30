import { MiniChef } from '../../generated/schema'
import { dataSource, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO, SUSHI_TOKEN_ADDRESS } from 'const'

export function getMiniChef(block: ethereum.Block): MiniChef {
  let miniChef = MiniChef.load(dataSource.address().toHex())

  if (miniChef === null) {
    miniChef = new MiniChef(dataSource.address().toHex())
    miniChef.sushi = SUSHI_TOKEN_ADDRESS
    miniChef.sushiPerSecond = BIG_INT_ZERO
    miniChef.totalAllocPoint = BIG_INT_ZERO
    miniChef.poolCount = BIG_INT_ZERO
  }

  miniChef.timestamp = block.timestamp
  miniChef.block = block.number
  miniChef.save()

  return miniChef as MiniChef
}

import { BentoBox } from '../../generated/schema'
import { dataSource, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from 'const'

export function getBentoBox(block: ethereum.Block): BentoBox {
  let bentoBox = BentoBox.load(dataSource.address().toHex())

  if (bentoBox === null) {
    bentoBox = new BentoBox(dataSource.address().toHex())
    bentoBox.totalTokens = BIG_INT_ZERO
    bentoBox.totalUsers = BIG_INT_ZERO
    bentoBox.totalKashiPairs = BIG_INT_ZERO
  }

  bentoBox.block = block.number
  bentoBox.timestamp = block.timestamp
  bentoBox.save()

  return bentoBox as BentoBox
}

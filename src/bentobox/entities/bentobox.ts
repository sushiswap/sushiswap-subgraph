import { BentoBox } from '../../../generated/schema'
import { dataSource } from '@graphprotocol/graph-ts'

export function getBentoBox(): BentoBox {
  let bentoBox = BentoBox.load(dataSource.address().toHex())

  if (bentoBox === null) {
    bentoBox = new BentoBox(dataSource.address().toHex())
    bentoBox.save()
  }

  // TODO: add block and timestamp and update it here every call if we do below
  //       may be good to add additonal props (totalTokens, totalPairs, totalUsers, etc)

  return bentoBox as BentoBox
}

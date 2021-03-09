import { BentoBox } from '../../../generated/schema'
import { BentoBox as BentoBoxContract } from '../../../generated/BentoBox/BentoBox'
import { dataSource } from '@graphprotocol/graph-ts'

export function getBentoBox(): BentoBox {
  let bentoBox = BentoBox.load(dataSource.address().toHex())

  if (bentoBox == null) {
    const bentoBoxContract = BentoBoxContract.bind(dataSource.address())
    bentoBox = new BentoBox(dataSource.address().toHex())
    bentoBox.save()
  }

  return bentoBox as BentoBox
}

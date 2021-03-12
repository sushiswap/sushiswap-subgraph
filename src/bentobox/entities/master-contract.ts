import { Address } from '@graphprotocol/graph-ts'
import { MasterContract } from '../../../generated/schema'
import { getBentoBox } from './bentobox'

export function getMasterContract(masterContract: Address): MasterContract {
  const bentoBox = getBentoBox()

  const id = masterContract.toHex()
  let masterContract = MasterContract.load(id)

  if (masterContract === null) {
    masterContract = new MasterContract(id)
    masterContract.bentoBox = bentoBox.id
    masterContract.save()
  }

  return masterContract as MasterContract
}

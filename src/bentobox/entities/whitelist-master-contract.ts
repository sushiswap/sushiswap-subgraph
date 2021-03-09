import { Address } from '@graphprotocol/graph-ts'
import { MasterContract } from '../../../generated/schema'

export function getMasterContract(masterContract: Address): MasterContract {
  const id = masterContract.toHex()

  let masterContract = MasterContract.load(id)

  if (masterContract === null) {
    masterContract = new MasterContract(id)
    masterContract.approved = false
    masterContract.save()
  }

  return masterContract as MasterContract
}

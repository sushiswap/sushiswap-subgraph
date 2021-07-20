import { Address, ethereum } from '@graphprotocol/graph-ts'
import { MasterContract } from '../../generated/schema'
import { getBentoBox } from './bentobox'

export function getMasterContract(masterContract: Address, block: ethereum.Block): MasterContract {
  const bentoBox = getBentoBox(block)

  const id = masterContract.toHex()
  let masterContract = MasterContract.load(id)

  if (masterContract === null) {
    masterContract = new MasterContract(id)
    masterContract.bentoBox = bentoBox.id
    masterContract.save()
  }

  return masterContract as MasterContract
}

import { Address } from '@graphprotocol/graph-ts'
import { MasterContractApproval } from '../../generated/schema'

export function getMasterContractApproval(user: Address, masterContract: Address): MasterContractApproval {
  const id = user.toHex().concat('-').concat(masterContract.toHex())

  let masterContractApproval = MasterContractApproval.load(id)

  if (masterContractApproval === null) {
    masterContractApproval = new MasterContractApproval(id)
    masterContractApproval.user = user.toHex()
    masterContractApproval.masterContract = masterContract.toHex()
    masterContractApproval.approved = false
    masterContractApproval.save()
  }

  return masterContractApproval as MasterContractApproval
}

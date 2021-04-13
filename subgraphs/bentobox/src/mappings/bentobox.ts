import {
  BENTOBOX_DEPOSIT
} from 'const'
import {
  LogDeploy,
  LogWhiteListMasterContract,
} from '../../generated/BentoBox/BentoBox'
import { Clone } from '../../generated/schema'
import {
  getMasterContract
} from '../entities'

import { log } from '@graphprotocol/graph-ts'

export function handleLogDeploy(event: LogDeploy): void {
  log.info('[BentoBox] Log Deploy {} {} {}', [
    event.params.masterContract.toHex(),
    event.params.data.toHex(),
    event.params.cloneAddress.toHex()
  ])

  getMasterContract(event.params.masterContract, event.block)

  let clone = new Clone(event.params.cloneAddress.toHex())
  clone.bentoBox = event.address.toHex()
  clone.masterContract = event.params.masterContract.toHex()
  clone.data = event.params.data.toHex()
  clone.block = event.block.number
  clone.timestamp = event.block.timestamp
  clone.save()
}

export function handleLogWhiteListMasterContract(event: LogWhiteListMasterContract): void {
  log.info('[BentoBox] Log White List Master Contract {} {}', [
    event.params.masterContract.toHex(),
    event.params.approved == true ? 'true' : 'false',
  ])

  getMasterContract(event.params.masterContract, event.block)
}

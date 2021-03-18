import { CancelTransaction, ExecuteTransaction, QueueTransaction } from '../generated/Timelock/Timelock'

import { BigInt } from '@graphprotocol/graph-ts'
import { Timelock } from '../generated/schema'

export function canceledTransaction(event: CancelTransaction): void {
  let id = event.params.txHash.toHexString()
  let tx = Timelock.load(id)
  if (tx !== null) {
    tx.isCanceled = true
    tx.canceledBlock = event.block.number
    tx.canceledTs = event.block.timestamp
    tx.canceledTx = event.transaction.hash.toHexString()
    tx.save()
  }
}

export function executedTransaction(event: ExecuteTransaction): void {
  let id = event.params.txHash.toHexString()
  let tx = Timelock.load(id)
  if (tx !== null) {
    tx.isExecuted = true
    tx.executedBlock = event.block.number
    tx.executedTs = event.block.timestamp
    tx.executedTx = event.transaction.hash.toHexString()
    tx.save()
  }
}

export function queuedTransaction(event: QueueTransaction): void {
  const GRACE_PERIOD = 14 // expiry period (days) - https://github.com/sushiswap/sushiswap/blob/26af8ce6d573346d06d254fe83248553523e1f96/contracts/Timelock.sol#L27
  let id = event.params.txHash.toHexString()
  let tx = Timelock.load(id)
  if (tx === null) {
    tx = new Timelock(id)
    tx.targetAddress = event.params.target.toHexString()
    tx.eta = event.params.eta
    tx.createdBlock = event.block.number
    tx.createdTs = event.block.timestamp
    tx.createdTx = event.transaction.hash.toHexString()
    tx.expiresTs = event.params.eta.plus(BigInt.fromI32(GRACE_PERIOD * 86400))
    tx.value = event.params.value
    tx.functionName = event.params.signature
    tx.data = event.params.data.toHexString()
    tx.isCanceled = false
    tx.isExecuted = false
    tx.save()
  }
}

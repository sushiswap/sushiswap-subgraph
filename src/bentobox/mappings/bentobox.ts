import { BENTOBOX_DEPOSIT, BENTOBOX_TRANSFER, BENTOBOX_WITHDRAW } from '../constants'
import {
  LogDeploy,
  LogDeposit,
  LogWithdraw,
  LogTransfer,
  LogFlashLoan,
  LogWhiteListMasterContract,
  LogSetMasterContractApproval,
  LogRegisterProtocol,
} from '../../../generated/BentoBox/BentoBox'
import { Token, User, FlashLoan, Protocol } from '../../../generated/schema'
import {
  getToken,
  getUser,
  getUserToken,
  getMasterContractApproval,
  getMasterContract,
} from '../entities'

import { createBentoBoxAction } from '../entities/bentobox-action'
import { log } from '@graphprotocol/graph-ts'

export function handleLogDeploy(event: LogDeploy): void {
  log.info('[BentoBox] Log Deploy {} {} {}', [
    event.params.masterContract.toHex(),
    event.params.data.toHex(),
    event.params.cloneAddress.toHex()
  ])

  // Need to figure out how these deploy events work now
  /*if (event.params.masterContract == BENTOBOX_MEDIUM_RISK_PAIR) {
    createPair(event.params.cloneAddress, event.block)

    incrementLendingPairsCount()

    PairTemplate.create(event.params.cloneAddress)
  }*/
}

export function handleLogDeposit(event: LogDeposit): void {
  log.info('[BentoBox] Log Deposit {} {} {} {} {}', [
    event.params.token.toHex(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString(),
    event.params.share.toString()
  ])

  const token = getToken(event.params.token, event.block)

  const userTokenData = getUserToken(getUser(event.params.to, event.block) as User, token as Token)
  userTokenData.amount = userTokenData.amount.plus(event.params.amount)
  userTokenData.share = userTokenData.share.plus(event.params.share)
  userTokenData.save()

  createBentoBoxAction(event, BENTOBOX_DEPOSIT)
}

export function handleLogWithdraw(event: LogWithdraw): void {
  log.info('[BentoBox] Log Withdraw {} {} {} {} {}', [
    event.params.token.toHex(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString(),
    event.params.share.toString()
  ])

  const token = getToken(event.params.token, event.block)

  const sender = getUserToken(getUser(event.params.from, event.block) as User, token as Token)
  sender.amount = sender.amount.minus(event.params.amount)
  sender.share = sender.share.minus(event.params.share)
  sender.save()

  createBentoBoxAction(event, BENTOBOX_WITHDRAW)
}

export function handleLogTransfer(event: LogTransfer): void {
  log.info('[BentoBox] Log Transfer {} {} {} {}', [
    event.params.token.toHex(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString(),
  ])

  const token = getToken(event.params.token, event.block)

  const sender = getUserToken(getUser(event.params.from, event.block) as User, token as Token)
  sender.amount = sender.amount.minus(event.params.share)
  sender.share = sender.share.minus(event.params.share)
  sender.save()

  const receiver = getUserToken(getUser(event.params.to, event.block) as User, token as Token)
  receiver.amount = receiver.amount.plus(event.params.share)
  receiver.share = receiver.share.plus(event.params.share)
  receiver.save()

  createBentoBoxAction(event, BENTOBOX_TRANSFER)
}

export function handleLogFlashLoan(event: LogFlashLoan): void {
  log.info('[BentoBox] Log Flash Loan {} {} {} {} {}', [
    event.params.borrower.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
    event.params.feeAmount.toString(),
    event.params.receiver.toHex()
  ])

  const token = getToken(event.params.token, event.block)

  const flashLoan = new FlashLoan(event.transaction.hash.toHex() + '-' + event.logIndex.toString())
  flashLoan.bentoBox = event.address.toHex()
  flashLoan.borrower = event.params.borrower
  flashLoan.token = token.id
  flashLoan.amount = event.params.amount
  flashLoan.feeAmount = event.params.feeAmount
  flashLoan.receiver = event.params.receiver
  flashLoan.save()
}

export function handleLogWhiteListMasterContract(event: LogWhiteListMasterContract): void {
  log.info('[BentoBox] Log White List Master Contract {} {}', [
    event.params.masterContract.toHex(),
    event.params.approved == true ? 'true' : 'false',
  ])
  const masterContract = getMasterContract(event.params.masterContract)
  masterContract.approved = event.params.approved
  masterContract.save()
}

export function handleLogMasterContractApproval(event: LogSetMasterContractApproval): void {
  log.info('[BentoBox] Log Set Master Contract Approval {} {} {}', [
    event.params.masterContract.toHex(),
    event.params.user.toHex(),
    event.params.approved == true ? 'true' : 'false'
  ])

  getUser(event.params.user, event.block)
  const masterContractApproval = getMasterContractApproval(event.params.user, event.params.masterContract)
  masterContractApproval.approved = event.params.approved
  masterContractApproval.save()
}

export function handleLogRegisterProtocol(event: LogRegisterProtocol): void {
  log.info('[BentoBox] Log Register Protocol {}', [
    event.params.protocol.toHex()
  ])

  let registeredProtocol = Protocol.load(event.params.protocol.toHex())
  if (registeredProtocol === null) {
    registeredProtocol = new Protocol(event.params.protocol.toHex())
    registeredProtocol.save()
  }
}

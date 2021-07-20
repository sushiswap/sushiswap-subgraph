import {
  BENTOBOX_DEPOSIT,
  BENTOBOX_TRANSFER,
  BENTOBOX_WITHDRAW,
  KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS,
  KASHI_PAIR_MEDIUM_RISK_TYPE,
} from 'const'
import {
  LogDeploy,
  LogDeposit,
  LogWithdraw,
  LogTransfer,
  LogFlashLoan,
  LogWhiteListMasterContract,
  LogSetMasterContractApproval,
  LogRegisterProtocol,
} from '../../generated/BentoBox/BentoBox'
import { Token, User, FlashLoan, Protocol, Clone } from '../../generated/schema'
import {
  getToken,
  getUser,
  getUserToken,
  getMasterContractApproval,
  getMasterContract,
  createBentoBoxAction,
  createKashiPair,
  createFlashLoan,
} from '../entities'

import { KashiPair as PairTemplate } from '../../generated/templates'
import { log } from '@graphprotocol/graph-ts'

export function handleLogDeploy(event: LogDeploy): void {
  log.info('[BentoBox] Log Deploy {} {} {}', [
    event.params.masterContract.toHex(),
    event.params.data.toHex(),
    event.params.cloneAddress.toHex()
  ])

  let clone = new Clone(event.params.cloneAddress.toHex())
  clone.bentoBox = event.address.toHex()
  clone.masterContract = event.params.masterContract.toHex()
  clone.data = event.params.data.toHex()
  clone.block = event.block.number
  clone.timestamp = event.block.timestamp
  clone.save()

  if (event.params.masterContract == KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS) {
    createKashiPair(event.params.cloneAddress, event.block, KASHI_PAIR_MEDIUM_RISK_TYPE)
    PairTemplate.create(event.params.cloneAddress)
  }
}

export function handleLogDeposit(event: LogDeposit): void {
  log.info('[BentoBox] Log Deposit {} {} {} {} {}', [
    event.params.token.toHex(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString(),
    event.params.share.toString()
  ])

  const from = getUser(event.params.from, event.block)
  const to = getUser(event.params.to, event.block)

  const token = getToken(event.params.token, event.block)
  token.totalSupplyBase = token.totalSupplyBase.plus(event.params.share)
  token.totalSupplyElastic = token.totalSupplyElastic.plus(event.params.amount)
  token.save()

  const userTokenData = getUserToken(to, token as Token, event.block)
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

  const from = getUser(event.params.from, event.block)
  const to = getUser(event.params.to, event.block)

  const token = getToken(event.params.token, event.block)
  token.totalSupplyBase = token.totalSupplyBase.minus(event.params.share)
  token.totalSupplyElastic = token.totalSupplyElastic.minus(event.params.amount)

  const userTokenData = getUserToken(from, token as Token, event.block)
  userTokenData.share = userTokenData.share.minus(event.params.share)
  userTokenData.save()

  createBentoBoxAction(event, BENTOBOX_WITHDRAW)
}

export function handleLogTransfer(event: LogTransfer): void {
  log.info('[BentoBox] Log Transfer {} {} {} {}', [
    event.params.token.toHex(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString(),
  ])

  const from = getUser(event.params.from, event.block)
  const to = getUser(event.params.to, event.block)
  const token = getToken(event.params.token, event.block)

  const sender = getUserToken(from, token as Token, event.block)
  sender.share = sender.share.minus(event.params.share)
  sender.save()

  const receiver = getUserToken(to, token as Token, event.block)
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

  createFlashLoan(event)
}

export function handleLogWhiteListMasterContract(event: LogWhiteListMasterContract): void {
  log.info('[BentoBox] Log White List Master Contract {} {}', [
    event.params.masterContract.toHex(),
    event.params.approved == true ? 'true' : 'false',
  ])

  if (event.params.approved == true) {
    getMasterContract(event.params.masterContract, event.block)
  }
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

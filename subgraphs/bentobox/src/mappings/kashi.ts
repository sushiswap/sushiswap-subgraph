import {
  Approval,
  LogExchangeRate,
  LogAccrue,
  LogAddCollateral,
  LogAddAsset,
  LogRemoveCollateral,
  LogRemoveAsset,
  LogBorrow,
  LogRepay,
  LogFeeTo,
  LogWithdrawFees,
  OwnershipTransferred,
  Transfer,
} from '../../generated/templates/KashiPair/KashiPair'

import { BentoBox as BentoBoxContract } from '../../generated/BentoBox/BentoBox'

import {
  BENTOBOX_ADDRESS,
  BIG_INT_ONE_HUNDRED,
  BIG_INT_ZERO,
  PAIR_ADD_ASSET,
  PAIR_ADD_COLLATERAL,
  PAIR_BORROW,
  PAIR_REMOVE_ASSET,
  PAIR_REMOVE_COLLATERAL,
  PAIR_REPAY,
} from 'const'

import {
  getKashiPair,
  getUser,
  getUserKashiPair,
  updateKashiPairDayData,
  updateKashiPairHourData
} from '../entities'
import { createKashiPairAction } from '../entities/kashi-pair-action'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { getInterestPerYear, takeFee } from '../helpers/interest'

// TODO: add callHandler for liquidate function on KashiPairs

export function handleApproval(event: Approval): void {
  log.info('[BentoBox:KashiPair] Approval {} {} {}', [
    event.params._owner.toHex(),
    event.params._spender.toHex(),
    event.params._value.toString()
  ])
}

export function handleLogExchangeRate(event: LogExchangeRate): void {
  log.info('[BentoBox:KashiPair] Log Exchange Rate {}', [
    event.params.rate.toString()
  ])

  const pair = getKashiPair(event.address, event.block)
  pair.exchangeRate = event.params.rate
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()

  updateKashiPairDayData(event)
  updateKashiPairHourData(event)
}

export function handleLogAccrue(event: LogAccrue): void {
  log.info('[BentoBox:KashiPair] Log Accrue {} {} {} {}', [
    event.params.accruedAmount.toString(),
    event.params.feeFraction.toString(),
    event.params.rate.toString(),
    event.params.utilization.toString()
  ])

  const pair = getKashiPair(event.address, event.block)
  const extraAmount = event.params.accruedAmount
  const feeFraction = event.params.feeFraction

  pair.totalAssetBase = pair.totalAssetBase.plus(feeFraction)
  pair.totalBorrowElastic = pair.totalBorrowElastic.plus(extraAmount)
  pair.feesEarnedFraction = pair.feesEarnedFraction.plus(feeFraction)
  pair.interestPerSecond = event.params.rate
  pair.utilization = event.params.utilization

  const currentInterest = getInterestPerYear(pair.totalBorrowBase, pair.interestPerSecond, pair.lastAccrued, event.block.timestamp, pair.utilization)
  const currentSupplyAPR = takeFee(currentInterest.times(pair.utilization)).div(BigInt.fromString('1000000000000000000'))

  pair.lastAccrued = event.block.timestamp
  pair.supplyAPR = currentSupplyAPR
  pair.borrowAPR = currentInterest
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()

  updateKashiPairDayData(event)
  updateKashiPairHourData(event)
}

export function handleLogAddCollateral(event: LogAddCollateral): void {
    log.info('[BentoBox:KashiPair] Log Add Collateral {} {} {}', [
      event.params.from.toHex(),
      event.params.to.toHex(),
      event.params.share.toString()
    ])

    const share = event.params.share

    const pair = getKashiPair(event.address, event.block)
    pair.totalCollateralShare = pair.totalCollateralShare.plus(share)
    pair.block = event.block.number
    pair.timestamp = event.block.timestamp
    pair.save()

    // TODO: need to look into if we should be updating block and timestamp for
    //       User entity when adding Collateral
    //const user = getUser(event.params.from, event.block)
    //user.block = event.block.number
    //user.timestamp = event.block.timestamp
    //user.save()

    const userData = getUserKashiPair(event.params.to, event.address, event.block)
    userData.collateralShare = userData.collateralShare.plus(share)
    userData.save()

    const action = createKashiPairAction(event, PAIR_ADD_COLLATERAL)
    action.poolPercentage = share.div(pair.totalCollateralShare).times(BIG_INT_ONE_HUNDRED)
    action.save()

    updateKashiPairDayData(event)
    updateKashiPairHourData(event)
}

export function handleLogAddAsset(event: LogAddAsset): void {
  log.info('[BentoBox:KashiPair] Log Add Asset {} {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString(),
    event.params.fraction.toString()
  ])
  // elastic = BentoBox shares held by the KashiPair, base = Total fractions held by asset suppliers

  const share = event.params.share
  const fraction = event.params.fraction

  const pair = getKashiPair(event.address, event.block)
  pair.totalAssetElastic = pair.totalAssetElastic.plus(share)
  pair.totalAssetBase = pair.totalAssetBase.plus(fraction)
  pair.save()


  // TODO: see if we need update user entity

  const userData = getUserKashiPair(event.params.to, event.address, event.block)
  userData.assetFraction = userData.assetFraction.plus(fraction)
  userData.save()

  const action = createKashiPairAction(event, PAIR_ADD_ASSET)
  action.poolPercentage = fraction.div(pair.totalAssetBase).times(BIG_INT_ONE_HUNDRED)
  action.save()

  updateKashiPairDayData(event)
  updateKashiPairHourData(event)
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
  log.info('[BentoBox:KashiPair] Log Remove Collateral {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString()
  ])

  const share = event.params.share
  const pair = getKashiPair(event.address, event.block)
  const poolPercentage = share.div(pair.totalCollateralShare).times(BIG_INT_ONE_HUNDRED)

  pair.totalCollateralShare = pair.totalCollateralShare.minus(share)
  pair.save()

  // TODO: see if we want to update the users (maybe event add more props)

  const userData = getUserKashiPair(event.params.from, event.address, event.block)
  userData.collateralShare = userData.collateralShare.minus(share)
  userData.save()

  const action = createKashiPairAction(event, PAIR_REMOVE_COLLATERAL)
  action.poolPercentage = poolPercentage
  action.save()

  updateKashiPairDayData(event)
  updateKashiPairHourData(event)
}

export function handleLogRemoveAsset(event: LogRemoveAsset): void {
  log.info('[BentoBox:KashiPair] Log Remove Asset {} {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString(),
    event.params.fraction.toString()
  ])
  // elastic = BentoBox shares held by the KashiPair, base = Total fractions held by asset suppliers

  const share = event.params.share
  const fraction = event.params.fraction
  const pair = getKashiPair(event.address, event.block)
  const poolPercentage = fraction.div(pair.totalAssetBase).times(BIG_INT_ONE_HUNDRED)


  pair.totalAssetElastic = pair.totalAssetElastic.minus(share)
  pair.totalAssetBase = pair.totalAssetBase.minus(fraction)
  pair.save()

  //TODO: maybe update user and check if solvent

  const userData = getUserKashiPair(event.params.from, event.address, event.block)
  userData.assetFraction = userData.assetFraction.minus(fraction)
  userData.save()

  const action = createKashiPairAction(event, PAIR_REMOVE_ASSET)
  action.poolPercentage = poolPercentage
  action.save()

  updateKashiPairDayData(event)
  updateKashiPairHourData(event)
}

export function handleLogBorrow(event: LogBorrow): void {
  log.info('[BentoBox:KashiPair] Log Borrow {} {} {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString(),
    event.params.feeAmount.toString(),
    event.params.part.toString()
  ])
  // elastic = Total token amount to be repayed by borrowers, base = Total parts of the debt held by borrowers

  const amount = event.params.amount
  const feeAmount = event.params.feeAmount
  const part = event.params.part

  const pair = getKashiPair(event.address, event.block)
  pair.totalBorrowBase = pair.totalBorrowBase.plus(part)
  pair.totalBorrowElastic = pair.totalBorrowElastic.plus(amount).plus(feeAmount)

  // TODO: may need to do a contact call to bentoBox and call the toShare function to get the amount to subtract by
  //       check that is working properly
  const bentoBoxContract = BentoBoxContract.bind(BENTOBOX_ADDRESS)
  let share = bentoBoxContract.toShare(Address.fromString(pair.asset), amount, false)
  pair.totalAssetElastic = pair.totalAssetElastic.minus(share)
  pair.save()

  // TODO: probaly update User and check if solvent

  const userData = getUserKashiPair(event.params.from, event.address, event.block)
  userData.borrowPart = userData.borrowPart.plus(part)
  userData.save()

  const action = createKashiPairAction(event, PAIR_BORROW)
  action.poolPercentage = part.div(pair.totalBorrowBase).times(BIG_INT_ONE_HUNDRED)
  action.save()

  updateKashiPairDayData(event)
  updateKashiPairHourData(event)
}

export function handleLogRepay(event: LogRepay): void {
  log.info('[BentoBox:KashiPair] Log Repay {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString(),
    event.params.part.toString()
  ])
  // elastic = Total token amount to be repayed by borrowers, base = Total parts of the debt held by borrowers

  const amount = event.params.amount
  const part = event.params.part
  const pair = getKashiPair(event.address, event.block)
  const poolPercentage = part.div(pair.totalBorrowBase).times(BIG_INT_ONE_HUNDRED)

  pair.totalBorrowBase = pair.totalBorrowBase.minus(part)
  pair.totalBorrowElastic = pair.totalBorrowElastic.minus(amount)

  const bentoBoxContract = BentoBoxContract.bind(BENTOBOX_ADDRESS)
  let share = bentoBoxContract.toShare(Address.fromString(pair.asset), amount, false)
  pair.totalAssetElastic = pair.totalAssetElastic.plus(share)
  pair.save()

  // TODO: probaly update User and check if solvent
  const userData = getUserKashiPair(event.params.to, event.address, event.block)
  userData.borrowPart = userData.borrowPart.minus(part)
  userData.save()

  const action = createKashiPairAction(event, PAIR_REPAY)
  action.poolPercentage = poolPercentage
  action.save()

  updateKashiPairDayData(event)
  updateKashiPairHourData(event)
}

export function handleLogFeeTo(event: LogFeeTo): void {
  log.info('[BentoBox:KashiPair] Log Fee To {}', [event.params.newFeeTo.toHex()])

  // TODO: I think the block and timestamp should be updated everytime getPair is called
  //       same getUser and maybe even UserKashiPair
  const pair = getKashiPair(event.address, event.block)
  pair.feeTo = event.params.newFeeTo
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()
}

export function handleLogWithdrawFees(event: LogWithdrawFees): void {
  log.info('[BentoBox:KashiPair] Log Withdraw Fees {} {}', [
    event.params.feeTo.toHex(),
    event.params.feesEarnedFraction.toString()
  ])

  // TODO: fix block and timestamp updates as asked in above function
  const pair = getKashiPair(event.address, event.block)
  pair.feesEarnedFraction = BIG_INT_ZERO
  pair.totalFeesEarnedFraction = pair.totalFeesEarnedFraction.plus(event.params.feesEarnedFraction)
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()

  // TODO: add function within kashi-pair-data to update totalFees for hour and day data
  //       then call those functions here
}

export function handleTransfer(event: Transfer): void {
  // TODO: not sure if we should do anything or not for this event
}

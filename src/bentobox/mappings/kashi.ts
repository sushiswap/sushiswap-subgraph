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
} from '../../../generated/templates/KashiPair/KashiPair'

import {
  BIG_INT_ONE_HUNDRED,
  PAIR_ADD_ASSET,
  PAIR_ADD_COLLATERAL,
  PAIR_BORROW,
  PAIR_REMOVE_ASSET,
  PAIR_REMOVE_COLLATERAL,
  PAIR_REPAY,
} from '../constants'

import { getKashiPair, getUser, getUserKashiPair } from '../entities'
import { createKashiPairAction } from '../entities/pair-action'
import { log } from '@graphprotocol/graph-ts'

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
  pair.exchangeRate = pair.exchangeRate.plus(event.params.rate)
  pair.save()
}

export function handleLogAccrue(event: LogAccrue): void {
  log.info('[BentoBox:KashiPair] Log Accrue {} {} {} {}', [
    event.params.accruedAmount.toString(),
    event.params.feeFraction.toString(),
    event.params.rate.toString(),
    event.params.utilization.toString()
  ])

  // TODO: this probably needs to be re-worked to work with feeFraction
  const pair = getKashiPair(event.address, event.block)
  const extraAmount = event.params.accruedAmount
  const feeFraction = event.params.feeFraction

  pair.totalAsset = pair.totalAsset.plus(extraAmount.minus(feeFraction))
  pair.totalBorrow = pair.totalBorrow.plus(earnedAmount)
  pair.feesEarnedFraction = pair.feesEarnedFraction.plus(feeFraction)
  pair.interestPerSecond = event.params.rate
  pair.utilization = event.params.utilization
  pair.lastBlockAccrued = event.block.number
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()
}

export function handleLogAddCollateral(event: LogAddCollateral): void {
    log.info('[BentoBox:KashiPair] Log Add Collateral {} {} {}', [
      event.params.from.toHex(),
      event.params.to.toHex(),
      event.params.share.toString()
    ])

    const share = event.params.share

    const pair = getKashiPair(event.params.to, event.block)
    pair.totalCollateral = pair.totalCollateral.plus(share)
    pair.save()

    getUser(event.params.from, event.block)
    const userData = getUserKashiPair(event.params.from, event.params.to)
    userData.userCollateralShare = userData.userCollateralShare.plus(share)
    userData.save()

    log.debug('pair-id: {}, collateral: {}', [event.address.toHex(), pair.collateral])

    const action = createKashiPairAction(event, PAIR_ADD_COLLATERAL)
    action.poolPercentage = share.div(pair.totalCollateral).times(BIG_INT_ONE_HUNDRED)
    action.save()
}

export function handleLogAddAsset(event: LogAddAsset): void {
  log.info('[BentoBox:KashiPair] Log Add Asset {} {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString(),
    event.params.fraction.toString()
  ])

  const share = event.params.share
  const fraction = event.params.fraction

  const pair = getKashiPair(event.address, event.block)
  pair.totalAsset = pair.totalAsset.plus(share)
  pair.totalAssetFraction = pair.totalAssetFraction.plus(fraction)
  pair.save()

  getUser(event.params.from, event.block)
  const userData = getUserKashiPair(event.params.from, event.address)
  userData.balanceOf = userData.balanceOf.plus(fraction)
  userData.save()

  const action = createKashiPairAction(event, PAIR_ADD_ASSET)
  action.poolPercentage = fraction.div(pair.totalAssetFraction).times(BIG_INT_ONE_HUNDRED)
  action.save()
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
  log.info('[BentoBox:KashiPair] Log Remove Collateral {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString()
  ])

  const share = event.params.share

  const pair = getKashiPair(event.address, event.block)

  const poolPercentage = share.div(pair.totalCollateral).times(BIG_INT_ONE_HUNDRED)

  pair.totalCollateral = pair.totalCollateral.minus(share)
  pair.save()

  const userData = getUserKashiPair(event.params.from, event.address)
  userData.userCollateralShare = user.userCollateralShare.minus(share)
  userData.save()

  const action = createKashiPairAction(event, PAIR_REMOVE_COLLATERAL)
  action.poolPercentage = poolPercentage
  action.save()
}

export function handleLogRemoveAsset(event: LogRemoveAsset): void {
  log.info('[BentoBox:KashiPair] Log Remove Asset {} {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.share.toString(),
    event.params.fraction.toString()
  ])

  const share = event.params.share
  const fraction = event.params.fraction

  const pair = getKashiPair(event.address, event.block)

  const poolPercentage = fraction.div(pair.totalAssetFraction).times(BIG_INT_ONE_HUNDRED)

  pair.totalAssetFraction = pair.totalAssetFraction.minus(fraction)
  pair.totalAsset = pair.totalAsset.minus(share)
  pair.save()

  const userData = getUserKashiPair(event.params.from, event.address)
  userData.balanceOf = userData.balanceOf.minus(fraction)
  userData.save()

  const action = createKashiPairAction(event, PAIR_REMOVE_ASSET)
  action.poolPercentage = poolPercentage
  action.save()
}

export function handleLogBorrow(event: LogBorrow): void {
  log.info('[BentoBox:KashiPair] Log Borrow {} {} {} {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString(),
    event.params.feeAmount.toString(),
    event.params.part.toString()
  ])

  // TODO: need to figure out the logic for borrow events, mainly what to do with the part
  // part -> Total part of the debt held by borrowers.


}

export function handleLogRepay(event: LogRepay): void {
  log.info('[BentoBox:KashiPair] Log Repay {} {}', [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString(),
    event.params.part.toString()
  ])

  // TODO: need to figure out the logic for repay events as well
  // @param part The amount to repay. See `userBorrowPart`.

}

export function handleLogFeeTo(event: LogFeeTo): void {
  log.info('[BentoBox:KashiPair] Log Fee To {}', [event.params.newFeeTo])

  const pair = getKashiPair(event.address, event.block)
  pair.feeTo = event.params.newFeeTo
  pair.block = event.block.number()
  pair.timestamp = event.block.timestamp()
  pair.save()
}

export function handleLogWithdrawFees(event: LogWithdrawFees): void {
  log.info('[BentoBox:KashiPair] Log Withdraw Fees {} {}', [
    event.params.feeTo,
    event.params.feesEarnedFraction
  ])

  const pair = getKashiPair(event.address, event.block)
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()
}

import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'

import {
  MINIMUM_TARGET_UTILIZATION,
  MAXIMUM_TARGET_UTILIZATION,
  UTILIZATION_PRECISION,
  FULL_UTILIZATION,
  FULL_UTILIZATION_MINUS_MAX,
  STARTING_INTEREST_PER_YEAR,
  MINIMUM_INTEREST_PER_YEAR,
  MAXIMUM_INTEREST_PER_YEAR,
  INTEREST_ELASTICITY,
  FACTOR_PRECISION
} from '../kashi-constants'

import {
  BIG_INT_ZERO,
} from 'const'

export function takeFee(amount: BigInt): BigInt {
  return amount.times(BigInt.fromI32(9)).div(BigInt.fromI32(10))
}

export function getInterestPerYear(totalBorrow: BigInt, interestPerSecond: BigInt, lastTimestamp: BigInt, timestamp: BigInt, utilization: BigInt): BigInt {
    if (totalBorrow == BIG_INT_ZERO) {
      return STARTING_INTEREST_PER_YEAR
    }

    let currentInterest = interestPerSecond.times(BigInt.fromI32(360)).times(BigInt.fromI32(24)).times(BigInt.fromI32(365))

    const elapsedTime = timestamp.div(BigInt.fromI32(1000)).minus(lastTimestamp)

    if (elapsedTime <= BIG_INT_ZERO) {
      return currentInterest
    }

    if (utilization < MINIMUM_TARGET_UTILIZATION) {
      const underFactor = MINIMUM_TARGET_UTILIZATION.minus(utilization)
        .times(FACTOR_PRECISION)
        .div(MINIMUM_TARGET_UTILIZATION)

      const scale = INTEREST_ELASTICITY.plus(underFactor.times(underFactor.times(elapsedTime)))
      currentInterest = currentInterest.times(INTEREST_ELASTICITY).div(scale)

      if (currentInterest < MINIMUM_INTEREST_PER_YEAR) {
        currentInterest = MINIMUM_INTEREST_PER_YEAR // 0.25% APR minimum
      }
    } else if (utilization > MAXIMUM_TARGET_UTILIZATION) {
      const overFactor = utilization.minus(MAXIMUM_TARGET_UTILIZATION)
        .times(FACTOR_PRECISION.div(FULL_UTILIZATION_MINUS_MAX))

      const scale = INTEREST_ELASTICITY.plus(overFactor.times(overFactor.times(elapsedTime)))
      currentInterest = currentInterest.times(scale).div(INTEREST_ELASTICITY)

      if (currentInterest > MAXIMUM_INTEREST_PER_YEAR) {
        currentInterest = MAXIMUM_INTEREST_PER_YEAR // 1000% APR maximum
      }
    }

    return currentInterest
}

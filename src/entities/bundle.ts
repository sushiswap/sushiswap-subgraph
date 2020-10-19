import { BigDecimal } from '@graphprotocol/graph-ts'
import { Bundle } from '../../generated/schema'
import { ZERO_BIG_DECIMAL } from '../constants'

export function getBundle(): Bundle {
  let bundle = Bundle.load('1')

  if (bundle === null) {
    bundle = new Bundle('1')
    bundle.ethPrice = ZERO_BIG_DECIMAL
    bundle.save()
  }

  return bundle as Bundle
}

import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export function bigIntToBigDecimal(value: BigInt, decimals: BigInt): BigDecimal {
  if (value == BigInt.fromI32(0)) {
    return value.toBigDecimal()
  }
  return value.toBigDecimal().div(exponentToBigDecimal(decimals))
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

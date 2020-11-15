import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  FACTORY_ADDRESS,
  SUSHI_USDT_PAIR_ADDRESS,
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_WETH_USDT_PAIR_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
  WETH_USDT_PAIR_ADDRESS,
} from './constants'

import { Factory as FactoryContract } from '../generated/Factory/Factory'
import { Pair as PairContract } from '../generated/Factory/Pair'

// PairContract.bind(SUSHI_USDT_PAIR_ADDRESS)

export function getUSDRate(token: Address, block: ethereum.Block): BigDecimal {
  let usdt = BIG_DECIMAL_ONE

  if (token != USDT_ADDRESS) {
    const pair = PairContract.bind(
      block.number.le(BigInt.fromI32(10829344)) ? UNISWAP_WETH_USDT_PAIR_ADDRESS : WETH_USDT_PAIR_ADDRESS
    )

    const reservesResult = pair.try_getReserves()

    if (reservesResult.reverted) {
      return BIG_DECIMAL_ZERO
    }

    const tokenETH = getEthRate(token, block)

    const reserve0 = reservesResult.value.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

    const reserve1 = reservesResult.value.value0.toBigDecimal()

    const ethUSD = reserve0.div(reserve1).div(BIG_DECIMAL_1E6)

    return ethUSD.times(tokenETH)
  }

  return usdt
}

export function getEthRate(token: Address, block: ethereum.Block): BigDecimal {
  let eth = BIG_DECIMAL_ONE

  if (token != WETH_ADDRESS) {
    const factory = FactoryContract.bind(
      block.number.le(BigInt.fromI32(10829344)) ? UNISWAP_FACTORY_ADDRESS : FACTORY_ADDRESS
    )

    const pair = PairContract.bind(factory.getPair(token, WETH_ADDRESS))

    const reservesResult = pair.try_getReserves()

    if (reservesResult.reverted) {
      return BIG_DECIMAL_ZERO
    }

    const rate =
      pair.token0() == WETH_ADDRESS
        ? reservesResult.value.value0
            .toBigDecimal()
            .times(BIG_DECIMAL_1E18)
            .div(reservesResult.value.value1.toBigDecimal())
        : reservesResult.value.value1
            .toBigDecimal()
            .times(BIG_DECIMAL_1E18)
            .div(reservesResult.value.value0.toBigDecimal())

    return rate.div(BIG_DECIMAL_1E18)
  }

  return eth
}

export function getSushiPrice(): BigDecimal {
  const pair = PairContract.bind(SUSHI_USDT_PAIR_ADDRESS)
  const reserves = pair.getReserves()
  return reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal()).div(BIG_DECIMAL_1E6)
}

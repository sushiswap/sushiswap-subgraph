import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  FACTORY_ADDRESS,
  SUSHISWAP_WETH_USDT_PAIR_ADDRESS,
  SUSHI_MAKER_ADDRESS,
  SUSHI_TOKEN_ADDRESS,
  SUSHI_USDT_PAIR_ADDRESS,
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_SUSHI_USDT_PAIR_ADDRESS,
  UNISWAP_WETH_USDT_PAIR_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
} from './constants'
import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts'

import { ERC20 as ERC20Contract } from '../generated/Factory/ERC20'
import { Factory as FactoryContract } from '../generated/Factory/Factory'
import { Pair as PairContract } from '../generated/Factory/Pair'

// PairContract.bind(SUSHI_USDT_PAIR_ADDRESS)

export function getUSDRate(token: Address, block: ethereum.Block): BigDecimal {
  let usdt = BIG_DECIMAL_ONE

  if (token != USDT_ADDRESS) {
    // const factory = FactoryContract.bind(
    //   block.number.le(BigInt.fromI32(10829344)) ? UNISWAP_FACTORY_ADDRESS : FACTORY_ADDRESS
    // )

    // First check for USDT quote
    // let address = factory.getPair(token, USDT_ADDRESS)

    let address = block.number.le(BigInt.fromI32(10829344))
      ? UNISWAP_WETH_USDT_PAIR_ADDRESS
      : SUSHISWAP_WETH_USDT_PAIR_ADDRESS

    const tokenPriceETH = getEthRate(token, block)

    const pair = PairContract.bind(address)

    const reserves = pair.getReserves()

    const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18)

    const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

    const ethPriceUSD = reserve1.div(reserve0).div(BIG_DECIMAL_1E6).times(BIG_DECIMAL_1E18)

    // log.info('ethPriceUSD: {}', [ethPriceUSD.toString()])

    const tokenContract = ERC20Contract.bind(token)

    // log.info('{} price USD: {}', [tokenContract.symbol(), ethPriceUSD.times(tokenPriceETH).toString()])

    return ethPriceUSD.times(tokenPriceETH)
  }

  return usdt
}

export function getEthRate(token: Address, block: ethereum.Block): BigDecimal {
  let eth = BIG_DECIMAL_ONE

  if (token != WETH_ADDRESS) {
    const factory = FactoryContract.bind(
      block.number.le(BigInt.fromI32(10829344)) ? UNISWAP_FACTORY_ADDRESS : FACTORY_ADDRESS
    )

    const address = factory.getPair(token, WETH_ADDRESS)

    if (address == ADDRESS_ZERO) {
      return BIG_DECIMAL_ZERO
    }

    const pair = PairContract.bind(address)

    const reserves = pair.getReserves()

    eth =
      pair.token0() == WETH_ADDRESS
        ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
        : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

    const tokenContract = ERC20Contract.bind(token)

    // log.info('{} price ETH: {}', [tokenContract.symbol(), eth.div(BIG_DECIMAL_1E18).toString()])

    return eth.div(BIG_DECIMAL_1E18)
  }

  return eth
}

export function getSushiPrice(block: ethereum.Block): BigDecimal {
  if (block.number.lt(BigInt.fromI32(10736320))) {
    // If before uniswap sushi-eth pair creation return zero
    return BIG_DECIMAL_ZERO
  } else if (block.number.lt(BigInt.fromI32(10800029))) {
    // Else if before uniswap sushi-usdt pair creation (get price from eth sushi-eth pair above)
    return getUSDRate(SUSHI_TOKEN_ADDRESS, block)
  } else {
    // Else get price from either uni or sushi usdt pair depending on space-time
    const pair = PairContract.bind(
      block.number.le(BigInt.fromI32(10829344)) ? UNISWAP_SUSHI_USDT_PAIR_ADDRESS : SUSHI_USDT_PAIR_ADDRESS
    )
    const reserves = pair.getReserves()
    return reserves.value1
      .toBigDecimal()
      .times(BIG_DECIMAL_1E18)
      .div(reserves.value0.toBigDecimal())
      .div(BIG_DECIMAL_1E6)
  }
}

import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  DAI,
  DAI_WETH_PAIR,
  FACTORY_ADDRESS,
  MINIMUM_LIQUIDITY_THRESHOLD_ETH,
  NATIVE,
  SUSHI_USDT_PAIR,
  USDC,
  USDC_WETH_PAIR,
  USDT,
  USDT_WETH_PAIR,
  WHITELIST,
} from 'const'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { Pair, Token } from '../generated/schema'

import { Factory as FactoryContract } from '../generated/templates/Pair/Factory'
import { Pair as PairContract } from '../generated/templates/Pair/Pair'

// export const uniswapFactoryContract = FactoryContract.bind(Address.fromString("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"))

export const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)

export function getSushiPrice(): BigDecimal {
  const pair = Pair.load(SUSHI_USDT_PAIR)

  if (pair) {
    return pair.token1Price
  }

  return BIG_DECIMAL_ZERO
}

export function getEthPrice(block: ethereum.Block = null): BigDecimal {
  // TODO: We can can get weighted averages, but this will do for now.
  // If block number is less than or equal to the last stablecoin migration (ETH-USDT), use uniswap eth price.
  // After this last migration, we can use sushiswap pricing.
  /*if (block !== null && block.number.le(BigInt.fromI32(10829344))) {
    // Uniswap Factory
    const uniswapFactory = FactoryContract.bind(Address.fromString('0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f'))

    // ETH-USDT
    const ethUsdtPair = uniswapFactory.getPair(
      Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
      Address.fromString('0xdac17f958d2ee523a2206206994597c13d831ec7')
    )

    const ethUsdtPairContract = PairContract.bind(ethUsdtPair)

    const ethUsdtReserves = ethUsdtPairContract.getReserves()

    // TODO: Find out why I'm dividing by 1,000,000... (Oh, probably because USDT?)
    const ethPrice = ethUsdtReserves.value1
      .toBigDecimal()
      .times(BIG_DECIMAL_1E18)
      .div(ethUsdtReserves.value0.toBigDecimal())
      .div(BigDecimal.fromString('1000000'))

    return ethPrice
  }*/

  // fetch eth prices for each stablecoin
  const daiPair = Pair.load(DAI_WETH_PAIR)
  const usdcPair = Pair.load(USDC_WETH_PAIR)
  const usdtPair = Pair.load(USDT_WETH_PAIR)

  // if (daiPair !== null) {
  //   log.warning('Dai Pair {} {}', [
  //     daiPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) ? 'true' : 'false',
  //     daiPair.reserveETH.toString(),
  //   ])
  // }

  // if (usdcPair !== null) {
  //   log.warning('Usdc Pair {} {}', [
  //     usdcPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) ? 'true' : 'false',
  //     usdcPair.reserveETH.toString(),
  //   ])
  // }

  // if (usdcPair !== null) {
  //   log.warning('Usdt Pair {} {}', [
  //     usdtPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) ? 'true' : 'false',
  //     usdtPair.reserveETH.toString(),
  //   ])
  // }

  if (
    daiPair !== null &&
    daiPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) &&
    usdcPair !== null &&
    usdcPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) &&
    usdtPair !== null &&
    usdtPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
  ) {
    const isDaiFirst = daiPair.token0 == DAI
    const isUsdcFirst = usdcPair.token0 == USDC
    const isUsdtFirst = usdtPair.token0 == USDT

    const daiPairEth = isDaiFirst ? daiPair.reserve1 : daiPair.reserve0

    const usdcPairEth = isUsdcFirst ? usdcPair.reserve1 : usdcPair.reserve0

    const usdtPairEth = isUsdtFirst ? usdtPair.reserve1 : usdtPair.reserve0

    const totalLiquidityETH = daiPairEth.plus(usdcPairEth).plus(usdtPairEth)

    const daiWeight = !isDaiFirst ? daiPair.reserve0.div(totalLiquidityETH) : daiPair.reserve1.div(totalLiquidityETH)

    const usdcWeight = !isUsdcFirst
      ? usdcPair.reserve0.div(totalLiquidityETH)
      : usdcPair.reserve1.div(totalLiquidityETH)

    const usdtWeight = !isUsdtFirst
      ? usdtPair.reserve0.div(totalLiquidityETH)
      : usdtPair.reserve1.div(totalLiquidityETH)

    const daiPrice = isDaiFirst ? daiPair.token0Price : daiPair.token1Price

    const usdcPrice = isUsdcFirst ? usdcPair.token0Price : usdcPair.token1Price

    const usdtPrice = isUsdtFirst ? usdtPair.token0Price : usdtPair.token1Price

    return daiPrice.times(daiWeight).plus(usdcPrice.times(usdcWeight)).plus(usdtPrice.times(usdtWeight))

    // dai and USDC have been created
  } else if (
    daiPair !== null &&
    daiPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) &&
    usdcPair !== null &&
    usdcPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
  ) {
    const isDaiFirst = daiPair.token0 == DAI
    const isUsdcFirst = usdcPair.token0 == USDC

    const daiPairEth = isDaiFirst ? daiPair.reserve1 : daiPair.reserve0

    const usdcPairEth = isUsdcFirst ? usdcPair.reserve1 : usdcPair.reserve0

    const totalLiquidityETH = daiPairEth.plus(usdcPairEth)

    const daiWeight = !isDaiFirst ? daiPair.reserve0.div(totalLiquidityETH) : daiPair.reserve1.div(totalLiquidityETH)

    const usdcWeight = !isUsdcFirst
      ? usdcPair.reserve0.div(totalLiquidityETH)
      : usdcPair.reserve1.div(totalLiquidityETH)

    const daiPrice = isDaiFirst ? daiPair.token0Price : daiPair.token1Price

    const usdcPrice = isUsdcFirst ? usdcPair.token0Price : usdcPair.token1Price

    return daiPrice.times(daiWeight).plus(usdcPrice.times(usdcWeight))
    // USDC is the only pair so far
  } else if (usdcPair !== null && usdcPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
    const isUsdcFirst = usdcPair.token0 == USDC
    return isUsdcFirst ? usdcPair.token0Price : usdcPair.token1Price
  } else if (usdtPair !== null && usdtPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
    const isUsdtFirst = usdtPair.token0 == USDT
    return isUsdtFirst ? usdtPair.token0Price : usdtPair.token1Price
  } else if (daiPair !== null && daiPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
    const isDaiFirst = daiPair.token0 == DAI
    return isDaiFirst ? daiPair.token0Price : daiPair.token1Price
  } else {
    log.warning('No eth pair...', [])
    return BIG_DECIMAL_ZERO
  }
}

export function findEthPerToken(token: Token): BigDecimal {
  if (Address.fromString(token.id) == NATIVE) {
    return BIG_DECIMAL_ONE
  }

  const whitelist = token.whitelistPairs

  for (let i = 0; i < whitelist.length; ++i) {
    const pairAddress = whitelist[i]
    const pair = Pair.load(pairAddress)

    if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
      const token1 = Token.load(pair.token1)

      return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
    }

    if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
      const token0 = Token.load(pair.token0)
      return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
    }
  }

  return BIG_DECIMAL_ZERO // nothing was found return 0
}

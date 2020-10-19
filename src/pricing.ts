import {
  ADDRESS_ZERO,
  DAI_WETH_PAIR,
  FACTORY_ADDRESS,
  MINIMUM_LIQUIDITY_THRESHOLD_ETH,
  ONE_BIG_DECIMAL,
  SUSHI_USDT_PAIR,
  USDC_WETH_PAIR,
  USDT_WETH_PAIR,
  WETH_ADDRESS,
  WHITELIST,
  ZERO_BIG_DECIMAL
} from './constants'
import { Address, BigDecimal } from '@graphprotocol/graph-ts/index'
import { Pair, Token } from '../generated/schema'

import { Factory as FactoryContract } from '../generated/templates/Pair/Factory'

// export const uniswapFactoryContract = FactoryContract.bind(Address.fromString("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f")) 

export const factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS))

export function getSushiPrice(): BigDecimal {
  const pair = Pair.load(SUSHI_USDT_PAIR)

  if (pair) {
    return pair.token1Price;
  }

  return ZERO_BIG_DECIMAL
}

export function getEthPrice(): BigDecimal {
  // fetch eth prices for each stablecoin
  const daiPair = Pair.load(DAI_WETH_PAIR) // dai is token0
  const usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token0
  const usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token1

  // all 3 have been created, get the weighted average of them
  if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
    const totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve1).plus(usdtPair.reserve0)
    const daiWeight = daiPair.reserve1.div(totalLiquidityETH)
    const usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
    const usdtWeight = usdtPair.reserve0.div(totalLiquidityETH)
    return daiPair.token0Price
      .times(daiWeight)
      .plus(usdcPair.token0Price.times(usdcWeight))
      .plus(usdtPair.token1Price.times(usdtWeight))
    // dai and USDC have been created
  } else if (daiPair !== null && usdcPair !== null) {
    const totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve1)
    const daiWeight = daiPair.reserve1.div(totalLiquidityETH)
    const usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
    return daiPair.token0Price.times(daiWeight).plus(usdcPair.token0Price.times(usdcWeight))
    // USDC is the only pair so far
  } else if (usdcPair !== null) {
    return usdcPair.token0Price
  } else {
    return ZERO_BIG_DECIMAL
  }
}

export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WETH_ADDRESS) {
    return ONE_BIG_DECIMAL
  }

  // loop through whitelist and check if paired with any

  // TODO: This is slow, and this function is called quite often.
  // What could we do to improve this?
  for (let i = 0; i < WHITELIST.length; ++i) {
    // TODO: Cont. This would be a good start, by avoiding multiple calls to getPair...
    const pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i])).toHex()
    if (pairAddress != ADDRESS_ZERO) {
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
  }

  return ZERO_BIG_DECIMAL // nothing was found return 0
}

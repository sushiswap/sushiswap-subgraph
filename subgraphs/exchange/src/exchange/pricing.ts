import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  DAI_WETH_PAIR,
  FACTORY_ADDRESS,
  MINIMUM_LIQUIDITY_THRESHOLD_ETH,
  SUSHI_USDT_PAIR,
  USDC_WETH_PAIR,
  USDT_WETH_PAIR,
  WETH_ADDRESS,
} from 'const'
import { WHITELIST } from './exchange-constants'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { Pair, Token } from '../../generated/schema'

import { Factory as FactoryContract } from '../../generated/templates/Pair/Factory'
import { Pair as PairContract } from '../../generated/templates/Pair/Pair'

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

  // TODO: the order can be wrong for the pairs above depending on the network
  //       commented out section below can be used when dai is token1 on the first pair

  // Mainnet version
  // DAI -> token0
  // USDT -> token1
  // USDC -> token0
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
    log.warning('No eth pair...', [])
    return BIG_DECIMAL_ZERO
  }

  // Matic version
  // DAI -> token1
  // USDT -> token1
  // USDC -> token0
  /*if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
   let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve1).plus(usdtPair.reserve0)
   let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
   let usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
   let usdtWeight = usdtPair.reserve0.div(totalLiquidityETH)
   return daiPair.token1Price
     .times(daiWeight)
     .plus(usdcPair.token0Price.times(usdcWeight))
     .plus(usdtPair.token1Price.times(usdtWeight))
   // dai and USDC have been created
 } else if (daiPair !== null && usdcPair !== null) {
   let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve1)
   let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
   let usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
   return daiPair.token1Price.times(daiWeight).plus(usdcPair.token0Price.times(usdcWeight))
   // USDC is the only pair so far
 } else if (usdcPair !== null) {
   return usdcPair.token0Price
 } else {
   log.warning('No eth pair...', [])
   return BIG_DECIMAL_ZERO
 }
}*/

}

export function findEthPerToken(token: Token): BigDecimal {
  if (Address.fromString(token.id) == WETH_ADDRESS) {
    return BIG_DECIMAL_ONE
  }

  // loop through whitelist and check if paired with any
  // TODO: This is slow, and this function is called quite often.
  // What could we do to improve this?
  for (let i = 0; i < WHITELIST.length; ++i) {
    // TODO: Cont. This would be a good start, by avoiding multiple calls to getPair...
    const pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]))
    if (pairAddress != ADDRESS_ZERO) {
      const pair = Pair.load(pairAddress.toHex())
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

  return BIG_DECIMAL_ZERO // nothing was found return 0
}

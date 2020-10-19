import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Token, TokenDayData } from '../../generated/schema'

import { ZERO_BIG_DECIMAL } from '../constants'
import { getBundle } from '.'

export function getTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
  const bundle = getBundle()

  const day = event.block.timestamp.toI32() / 86400

  const date = day * 86400

  const id = token.id.toString().concat('-').concat(BigInt.fromI32(day).toString())

  let tokenDayData = TokenDayData.load(id)

  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(id)
    tokenDayData.date = date
    tokenDayData.token = token.id
    tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPrice)
    tokenDayData.volume = ZERO_BIG_DECIMAL
    tokenDayData.volumeETH = ZERO_BIG_DECIMAL
    tokenDayData.volumeUSD = ZERO_BIG_DECIMAL
    tokenDayData.liquidityUSD = ZERO_BIG_DECIMAL
    tokenDayData.txCount = BigInt.fromI32(0)
  }

  return tokenDayData as TokenDayData
}

export function updateTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
  const bundle = getBundle()

  const tokenDayData = getTokenDayData(token, event)

  tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPrice)
  tokenDayData.liquidity = token.liquidity
  tokenDayData.liquidityETH = token.liquidity.times(token.derivedETH as BigDecimal)
  tokenDayData.liquidityUSD = tokenDayData.liquidityETH.times(bundle.ethPrice)
  tokenDayData.txCount = tokenDayData.txCount.plus(BigInt.fromI32(1))

  tokenDayData.save()

  return tokenDayData as TokenDayData
}

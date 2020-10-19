import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { LiquidityPosition, Pair } from '../../generated/schema'
import { ZERO_BIG_DECIMAL, ZERO_BIG_INT } from '../constants'

import { getPair } from './pair'

// TODO: getLiquidityPosition
// export function getLiquidityPosition(id: string): LiquidityPosition {}

// TODO: getLiquidityPositions
// export function getLiquidityPositions(ids: string[]): LiquidityPosition[] {}

export function createLiquidityPosition(user: Address, pair: Address, block: ethereum.Block): LiquidityPosition {
  const pairAddress = pair.toHex()

  const userAddress = user.toHex()

  const id = pairAddress.concat('-').concat(userAddress)

  let liquidityPosition = LiquidityPosition.load(id)

  if (liquidityPosition === null) {
    // const pair = Pair.load(pairAddress)
    // const pair = getPair(Address.fromString(pairAddress), block)

    // TODO: We should do the inverse when a liquidity provider becomes inactive (removes all liquidity)
    // pair.liquidityProviderCount = pair.liquidityProviderCount.plus(BigInt.fromI32(1))
    // pair.save()

    const timestamp = block.timestamp.toI32()

    liquidityPosition = new LiquidityPosition(id)
    liquidityPosition.liquidityTokenBalance = ZERO_BIG_DECIMAL

    liquidityPosition.user = userAddress
    liquidityPosition.pair = pairAddress

    liquidityPosition.block = block.number.toI32()
    liquidityPosition.timestamp = timestamp

    liquidityPosition.lca = ZERO_BIG_DECIMAL
    liquidityPosition.lcad = ZERO_BIG_DECIMAL

    liquidityPosition.liquidityTokenBurned = ZERO_BIG_DECIMAL
    liquidityPosition.liquidityTokenMinted = ZERO_BIG_DECIMAL

    liquidityPosition.burnCount = ZERO_BIG_INT
    liquidityPosition.mintCount = ZERO_BIG_INT

    liquidityPosition.lastBurn = block.timestamp
    liquidityPosition.lastMint = block.timestamp

    liquidityPosition.save()
  }

  return liquidityPosition as LiquidityPosition
}

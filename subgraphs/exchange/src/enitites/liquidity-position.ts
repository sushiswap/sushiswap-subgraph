import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO } from 'const'
import { LiquidityPosition, Pair } from '../../generated/schema'

import { Pair as PairContract } from '../../generated/templates/Pair/Pair'
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
    // const pairContract = PairContract.bind(pair)
    // const liquidityTokenBalance = pairContract.balanceOf(user).divDecimal(BigDecimal.fromString('1e18'))

    const timestamp = block.timestamp.toI32()

    liquidityPosition = new LiquidityPosition(id)
    liquidityPosition.liquidityTokenBalance = BIG_DECIMAL_ZERO

    liquidityPosition.user = userAddress
    liquidityPosition.pair = pairAddress

    liquidityPosition.block = block.number.toI32()
    liquidityPosition.timestamp = timestamp

    liquidityPosition.save()
  }

  return liquidityPosition as LiquidityPosition
}

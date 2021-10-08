import { Address, ethereum } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, FACTORY_ADDRESS, WHITELIST } from 'const'

import { Pair } from '../../generated/schema'
import { Pair as PairContract } from '../../generated/templates/Pair/Pair'
import { getToken } from '.'

export function getPair(
  address: Address,
  block: ethereum.Block = null,
  token0FromParams: Address = null,
  token1FromParams: Address = null
): Pair | null {
  let pair = Pair.load(address.toHex())

  if (pair === null) {
    const pairContract = PairContract.bind(address)

    const token0Address = token0FromParams || pairContract.token0()
    const token0 = getToken(token0Address)

    if (token0 === null) {
      return null
    }

    const token1Address = token1FromParams || pairContract.token1()
    const token1 = getToken(token1Address)

    if (token1 === null) {
      return null
    }

    pair = new Pair(address.toHex())

    if (WHITELIST.includes(token0.id)) {
      const newPairs = token1.whitelistPairs
      newPairs.push(pair.id)
      token1.whitelistPairs = newPairs
    }
    if (WHITELIST.includes(token1.id)) {
      const newPairs = token0.whitelistPairs
      newPairs.push(pair.id)
      token0.whitelistPairs = newPairs
    }

    token0.save()
    token1.save()

    pair.factory = FACTORY_ADDRESS.toHex()

    pair.name = token0.symbol.concat('-').concat(token1.symbol)

    pair.token0 = token0.id
    pair.token1 = token1.id
    pair.liquidityProviderCount = BIG_INT_ZERO

    pair.txCount = BIG_INT_ZERO
    pair.reserve0 = BIG_DECIMAL_ZERO
    pair.reserve1 = BIG_DECIMAL_ZERO
    pair.trackedReserveETH = BIG_DECIMAL_ZERO
    pair.reserveETH = BIG_DECIMAL_ZERO
    pair.reserveUSD = BIG_DECIMAL_ZERO
    pair.totalSupply = BIG_DECIMAL_ZERO
    pair.volumeToken0 = BIG_DECIMAL_ZERO
    pair.volumeToken1 = BIG_DECIMAL_ZERO
    pair.volumeUSD = BIG_DECIMAL_ZERO
    pair.untrackedVolumeUSD = BIG_DECIMAL_ZERO
    pair.token0Price = BIG_DECIMAL_ZERO
    pair.token1Price = BIG_DECIMAL_ZERO

    pair.timestamp = block.timestamp
    pair.block = block.number
  }

  return pair as Pair
}

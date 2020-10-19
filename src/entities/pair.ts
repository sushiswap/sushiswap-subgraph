import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS, ZERO_BIG_DECIMAL } from '../constants'
import { Pair, Token } from '../../generated/schema'

import { Pair as PairContract } from '../../generated/templates/Pair/Pair'
import { getToken } from '../entities'

export function getPair(address: Address, block: ethereum.Block = null): Pair {
  let pair = Pair.load(address.toHex())
  if (pair === null) {

    const pairContract = PairContract.bind(address)
  
    const token0 = getToken(pairContract.token1())
  
    const token1 = getToken(pairContract.token1())

    pair = new Pair(address.toHex()) as Pair

    pair.factory = FACTORY_ADDRESS
    pair.name = token0.symbol.concat('-').concat(token1.symbol)
  
    pair.token0 = token0.id
    pair.token1 = token1.id
    pair.liquidityProviderCount = BigInt.fromI32(0)
  
    pair.txCount = BigInt.fromI32(0)
    pair.reserve0 = ZERO_BIG_DECIMAL
    pair.reserve1 = ZERO_BIG_DECIMAL
    pair.trackedReserveETH = ZERO_BIG_DECIMAL
    pair.reserveETH = ZERO_BIG_DECIMAL
    pair.reserveUSD = ZERO_BIG_DECIMAL
    pair.totalSupply = ZERO_BIG_DECIMAL
    pair.volumeToken0 = ZERO_BIG_DECIMAL
    pair.volumeToken1 = ZERO_BIG_DECIMAL
    pair.volumeUSD = ZERO_BIG_DECIMAL
    pair.untrackedVolumeUSD = ZERO_BIG_DECIMAL
    pair.token0Price = ZERO_BIG_DECIMAL
    pair.token1Price = ZERO_BIG_DECIMAL
  
    pair.createdAtTimestamp = block.timestamp
    pair.createdAtBlockNumber = block.number

  }
  return pair as Pair
}

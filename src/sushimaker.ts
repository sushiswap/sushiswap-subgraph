import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ZERO,
  BIG_INT_ZERO,
  SUSHI_TOKEN_ADDRESS,
  FACTORY_ADDRESS,
  SUSHIMAKER_ADDRESS
} from './constants'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { PendingServing, PastServing } from '../generated/schema'
import { Pair as PairContract, Swap as SwapEvent } from '../generated/SushiMaker/Pair'
import { Maker as MakerContract } from '../generated/SushiMaker/Maker'
import { Factory as FactoryContract } from '../generated/SushiMaker/Factory'
import { SushiToken as SushiTokenContract } from '../generated/SushiMaker/SushiToken'

export function handleBlock(block: ethereum.Block): void {
  // Only update PendingServings every 1000 blocks
  if (block.number.toI32() % 1000 != 0) {
    return
  }

  const factory = FactoryContract.bind(FACTORY_ADDRESS)
  const allPairsLength = factory.allPairsLength()

  // calculate potential servings for each SLP pair
  for (let i = 0; i < allPairsLength.toI32(); i++) {
    let lpToken = factory.allPairs(BigInt.fromI32(i))
    let pair = PairContract.bind(lpToken)

    let pendingServing = PendingServing.load(lpToken.toHexString())
    if (pendingServing == null) {
      // init new pendingServing
      pendingServing = new PendingServing(lpToken.toHexString())
      pendingServing.lpToken = factory.allPairs(BigInt.fromI32(i))
      pendingServing.token0 = pair.token0()
      pendingServing.token1 = pair.token1()
    }

    // get balance of SLP token in Maker
    pendingServing.slpAmount = pair.balanceOf(SUSHIMAKER_ADDRESS)

    // calculate amount for each token in pair
    let lp_ratio = pair.totalSupply() * pendingServing.slpAmount
    let reserves = pair.getReserves()
    pendingServing.token0Amount = lp_ratio * reserves.value0
    pendingServing.token1Amount = lp_ratio * reserves.value1

    pendingServing.save()
  }
}

export function handleServeItUp(event: SwapEvent): void {

}

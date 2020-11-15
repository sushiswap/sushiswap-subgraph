import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ZERO,
  BIG_INT_ZERO,
  SUSHI_TOKEN_ADDRESS,
  FACTORY_ADDRESS,
  SUSHIMAKER_ADDRESS,
  SUSHIBAR_ADDRESS
} from './constants'
import { Address, BigDecimal, BigInt, ByteArray, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
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
  // check if it's a swap from SushiMaker to SushiBar
  if (event.params.sender != SUSHIMAKER_ADDRESS && event.params.to != SUSHIBAR_ADDRESS) {
    return
  }

  let convert_tx = event.transaction

  let input_data = convert_tx.input.toHexString()
  let token0 = Address.fromString(ByteArray.fromHexString(input_data.substring(34, 74)).toHexString())
  let token1 = Address.fromString(ByteArray.fromHexString(input_data.substring(98, 138)).toHexString())

  let factory = FactoryContract.bind(FACTORY_ADDRESS)
  let lpToken = factory.getPair(token0, token1)
  let pair = PairContract.bind(lpToken)

  // build up new PastServing entity
  let servingName = lpToken.toHexString() + '-' + event.block.number.toString()
  let serving = new PastServing(servingName)
  serving.from = convert_tx.from
  serving.tx = convert_tx.hash
  serving.lpToken = lpToken
  serving.token0 = token0
  serving.token1 = token1
  serving.block = event.block.number
  serving.blockTs = event.block.timestamp
  serving.sushiAmount = event.params.amount0Out

  serving.save()

  // reset pendingServing
  let pendingServing = PendingServing.load(lpToken.toHexString())
  pendingServing.slpAmount = BIG_INT_ZERO
  pendingServing.token0Amount = BIG_INT_ZERO
  pendingServing.token1Amount = BIG_INT_ZERO
  pendingServing.save()
}

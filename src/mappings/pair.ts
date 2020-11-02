import {
  ADDRESS_ZERO,
  MASTER_CHEF_ADDRESS,
  MINIMUM_USD_THRESHOLD_NEW_PAIRS,
  WHITELIST,
  ZERO_BIG_DECIMAL,
} from '../constants'
import { Address, BigDecimal, BigInt, log, store } from '@graphprotocol/graph-ts'
import { Burn, Mint, Pair, Swap, Token, Transaction } from '../../generated/schema'
import {
  Burn as BurnEvent,
  Mint as MintEvent,
  Pair as PairContract,
  Swap as SwapEvent,
  Sync as SyncEvent,
  Transfer as TransferEvent,
} from '../../generated/templates/Pair/Pair'
import {
  createLiquidityPosition,
  createLiquidityPositionSnapshot,
  getBundle,
  getFactory,
  getUser,
  updateDayData,
  updatePairDayData,
  updatePairHourData,
  updateTokenDayData,
} from '../entities'
import { findEthPerToken, getEthPrice } from '../pricing'

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  const bundle = getBundle()
  const price0 = token0.derivedETH.times(bundle.ethPrice)
  const price1 = token1.derivedETH.times(bundle.ethPrice)

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
    const reserve0USD = pair.reserve0.times(price0)
    const reserve1USD = pair.reserve1.times(price1)
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BIG_DECIMAL
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BIG_DECIMAL
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BIG_DECIMAL
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BIG_DECIMAL
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  const bundle = getBundle()
  const price0 = token0.derivedETH.times(bundle.ethPrice)
  const price1 = token1.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BIG_DECIMAL
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == BigInt.fromI32(0)) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

function isCompleteMint(mintId: string): boolean {
  return Mint.load(mintId).sender !== null // sufficient checks
}

export function onTransfer(event: TransferEvent): void {
  // ignore initial transfers for first adds
  if (event.params.to.toHex() == ADDRESS_ZERO && event.params.value.equals(BigInt.fromI32(1000))) {
    return
  }

  // log.info('handleTransfer start', [])

  const factory = getFactory()
  const transactionHash = event.transaction.hash.toHex()

  const from = getUser(event.params.from)
  const to = getUser(event.params.to)

  const pair = Pair.load(event.address.toHex())
  const pairContract = PairContract.bind(event.address)

  // liquidity token amount being transfered
  const value = event.params.value.divDecimal(BigDecimal.fromString('1e18'))

  let transaction = Transaction.load(transactionHash)

  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = new Array<string>()
    transaction.burns = new Array<string>()
    transaction.swaps = new Array<string>()
  }

  const mints = transaction.mints
  const burns = transaction.burns

  // 3 cases, mints, send first on ETH withdrawls, and burns

  if (event.params.from.toHex() == ADDRESS_ZERO) {
    // mints

    // update total supply
    pair.totalSupply = pair.totalSupply.plus(value)
    pair.save()

    // If transaction has no mints or last mint is complete
    if (transaction.mints.length == 0 || isCompleteMint(mints[mints.length - 1])) {
      // log.warning('1-1: NO MINTS OR LAST MINT IS COMPLETE', [])
      const mint = new Mint(event.transaction.hash.toHex().concat('-').concat(BigInt.fromI32(mints.length).toString()))
      mint.pair = pair.id
      mint.to = event.params.to
      mint.liquidity = value
      mint.timestamp = transaction.timestamp
      mint.transaction = transaction.id
      mint.save()

      transaction.mints = mints.concat([mint.id])

      // save entities
      transaction.save()
      factory.save()
    }
  } else if (event.params.to.toHex() == pair.id) {
    // case where direct send first on ETH withdrawls
    const burn = new Burn(
      event.transaction.hash.toHex().concat('-').concat(BigInt.fromI32(transaction.burns.length).toString())
    )
    burn.pair = pair.id
    burn.liquidity = value
    burn.timestamp = transaction.timestamp
    burn.to = event.params.to
    burn.sender = event.params.from
    burn.complete = false
    burn.transaction = transaction.id
    burn.save()

    transaction.burns = transaction.burns.concat([burn.id])

    transaction.save()
  } else if (event.params.to.toHex() == ADDRESS_ZERO && event.params.from.toHex() == pair.id) {
    // burns
    pair.totalSupply = pair.totalSupply.minus(value)
    pair.save()

    let burn: Burn | null = null

    // If transaction has burns
    if (transaction.burns.length) {
      burn = Burn.load(burns[burns.length - 1])
    }

    // If no burn or burn complete, create new burn
    if (burn === null || burn.complete) {
      burn = new Burn(event.transaction.hash.toHex().concat('-').concat(BigInt.fromI32(burns.length).toString()))
      burn.complete = true
      burn.pair = pair.id
      burn.liquidity = value
      burn.transaction = transaction.id
      burn.timestamp = transaction.timestamp
    }

    // if this logical burn included a fee mint, account for this
    if (mints.length != 0 && !isCompleteMint(mints[mints.length - 1])) {
      const mint = Mint.load(mints[mints.length - 1])

      burn.feeTo = mint.to
      burn.feeLiquidity = mint.liquidity

      // remove the logical mint
      store.remove('Mint', mints[mints.length - 1])

      // update the transaction
      transaction.mints = mints.slice(0, -1)
      transaction.save()
    }

    burn.save()

    if (!burn.complete) {
      // Burn is not complete, replace previous tail
      transaction.burns = burns.slice(0, -1).concat([burn.id])
    } else {
      // Burn is complete, concat to transactions
      transaction.burns = burns.concat([burn.id])
    }

    transaction.save()
  }

  // BURN
  // TODO: Exit?
  if (
    value.notEqual(BigDecimal.fromString('0')) &&
    event.params.to != MASTER_CHEF_ADDRESS &&
    event.params.from.toHex() != ADDRESS_ZERO &&
    event.params.from.toHex() != pair.id
  ) {
    const fromUserLiquidityPosition = createLiquidityPosition(event.params.from, event.address, event.block)

    const liquidityTokenBalance = pairContract.balanceOf(event.params.from).divDecimal(BigDecimal.fromString('1e18'))

    log.info('{} sent {} slp to {} for pair {} balance {} tx {}', [
      event.params.from == MASTER_CHEF_ADDRESS ? 'MASTERCHEF' : event.params.from.toHex(),
      value.toString(),
      event.params.to == MASTER_CHEF_ADDRESS ? 'MASTERCHEF' : event.params.to.toHex(),
      pair.name,
      liquidityTokenBalance.toString(),
      event.transaction.hash.toHex(),
    ])

    fromUserLiquidityPosition.liquidityTokenBalance = liquidityTokenBalance

    fromUserLiquidityPosition.save()

    createLiquidityPositionSnapshot(fromUserLiquidityPosition, event.block)
  }

  // MINT
  // TODO: Recieve LP Tokens?
  if (
    value.notEqual(BigDecimal.fromString('0')) &&
    event.params.from != MASTER_CHEF_ADDRESS &&
    event.params.to.toHex() != ADDRESS_ZERO &&
    event.params.to.toHex() != pair.id
  ) {
    const toUserLiquidityPosition = createLiquidityPosition(event.params.to, event.address, event.block)

    const liquidityTokenBalance = pairContract.balanceOf(event.params.to).divDecimal(BigDecimal.fromString('1e18'))

    log.info('{} recieved {} slp from {} for pair {} balance {} tx {}', [
      event.params.to == MASTER_CHEF_ADDRESS ? 'MASTERCHEF' : event.params.to.toHex(),
      value.toString(),
      event.params.from == MASTER_CHEF_ADDRESS ? 'MASTERCHEF' : event.params.from.toHex(),
      pair.name,
      liquidityTokenBalance.toString(),
      event.transaction.hash.toHex(),
    ])

    toUserLiquidityPosition.liquidityTokenBalance = liquidityTokenBalance

    toUserLiquidityPosition.save()

    createLiquidityPositionSnapshot(toUserLiquidityPosition, event.block)
  }

  transaction.save()
}

export function onSync(event: SyncEvent): void {
  const pair = Pair.load(event.address.toHex())
  const token0 = Token.load(pair.token0)
  const token1 = Token.load(pair.token1)
  const factory = getFactory()

  // reset factory liquidity by subtracting only tracked liquidity
  factory.liquidityETH = factory.liquidityETH.minus(pair.trackedReserveETH as BigDecimal)

  // reset token total liquidity amounts
  token0.liquidity = token0.liquidity.minus(pair.reserve0)
  token1.liquidity = token1.liquidity.minus(pair.reserve1)

  pair.reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals)
  pair.reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals)

  if (pair.reserve1.notEqual(ZERO_BIG_DECIMAL)) {
    pair.token0Price = pair.reserve0.div(pair.reserve1)
  } else {
    pair.token0Price = ZERO_BIG_DECIMAL
  }

  if (pair.reserve0.notEqual(ZERO_BIG_DECIMAL)) {
    pair.token1Price = pair.reserve1.div(pair.reserve0)
  } else {
    pair.token1Price = ZERO_BIG_DECIMAL
  }

  pair.save()

  // update ETH price now that reserves could have changed
  const bundle = getBundle()
  bundle.ethPrice = getEthPrice()
  bundle.save()

  token0.derivedETH = findEthPerToken(token0 as Token)
  token1.derivedETH = findEthPerToken(token1 as Token)
  token0.save()
  token1.save()

  // get tracked liquidity - will be 0 if neither is in whitelist
  let trackedLiquidityETH: BigDecimal
  if (bundle.ethPrice.notEqual(ZERO_BIG_DECIMAL)) {
    trackedLiquidityETH = getTrackedLiquidityUSD(pair.reserve0, token0 as Token, pair.reserve1, token1 as Token).div(
      bundle.ethPrice
    )
  } else {
    trackedLiquidityETH = ZERO_BIG_DECIMAL
  }

  // use derived amounts within pair
  pair.trackedReserveETH = trackedLiquidityETH
  pair.reserveETH = pair.reserve0
    .times(token0.derivedETH as BigDecimal)
    .plus(pair.reserve1.times(token1.derivedETH as BigDecimal))
  pair.reserveUSD = pair.reserveETH.times(bundle.ethPrice)

  // use tracked amounts globally
  factory.liquidityETH = factory.liquidityETH.plus(trackedLiquidityETH)
  factory.liquidityUSD = factory.liquidityETH.times(bundle.ethPrice)

  // now correctly set liquidity amounts for each token
  token0.liquidity = token0.liquidity.plus(pair.reserve0)
  token1.liquidity = token1.liquidity.plus(pair.reserve1)

  // save entities
  pair.save()
  factory.save()
  token0.save()
  token1.save()
}

export function onMint(event: MintEvent): void {
  const transaction = Transaction.load(event.transaction.hash.toHex())

  const mints = transaction.mints

  const mint = Mint.load(mints[mints.length - 1])

  const pair = Pair.load(event.address.toHex())

  const factory = getFactory()

  const token0 = Token.load(pair.token0)
  const token1 = Token.load(pair.token1)

  // update exchange info (except balances, sync will cover that)
  const token0Amount = convertTokenToDecimal(event.params.amount0, token0.decimals)
  const token1Amount = convertTokenToDecimal(event.params.amount1, token1.decimals)

  // update tx counts
  token0.txCount = token0.txCount.plus(BigInt.fromI32(1))
  token1.txCount = token1.txCount.plus(BigInt.fromI32(1))

  // get new amounts of USD and ETH for tracking
  const bundle = getBundle()
  const amountTotalUSD = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount))
    .times(bundle.ethPrice)

  // update txn counts
  pair.txCount = pair.txCount.plus(BigInt.fromI32(1))

  factory.txCount = factory.txCount.plus(BigInt.fromI32(1))

  // save entities
  token0.save()
  token1.save()
  pair.save()
  factory.save()

  mint.sender = event.params.sender
  mint.amount0 = token0Amount as BigDecimal
  mint.amount1 = token1Amount as BigDecimal
  mint.logIndex = event.logIndex
  mint.amountUSD = amountTotalUSD as BigDecimal
  mint.save()

  // create liquidity position
  const liquidityPosition = createLiquidityPosition(mint.to as Address, event.address, event.block)

  liquidityPosition.mintCount = liquidityPosition.mintCount.plus(BigInt.fromI32(1))

  const days = event.block.timestamp.minus(liquidityPosition.lastMint).divDecimal(BigDecimal.fromString('86400'))

  liquidityPosition.liquidityTokenMinted = liquidityPosition.liquidityTokenMinted.plus(mint.liquidity)

  const lca = liquidityPosition.lca
    .plus(days.times(liquidityPosition.liquidityTokenBalance))
    .div(liquidityPosition.mintCount.toBigDecimal())

  log.info('MINT lca {} liquidity token balance {} days {} ts diff {}', [
    lca.toString(),
    liquidityPosition.liquidityTokenBalance.toString(),
    days.toString(),
    event.block.timestamp.minus(liquidityPosition.lastMint).toString(),
  ])

  liquidityPosition.lca = lca

  liquidityPosition.lastMint = event.block.timestamp

  liquidityPosition.save()

  log.info('{} minted {} slp tokens for pool {} in exchange of token0: {} {} token1: {} {} tx: {}', [
    mint.sender.toHex(),
    mint.liquidity.toString(),
    pair.name,
    token0Amount.toString(),
    token0.name,
    token1Amount.toString(),
    token1.name,
    mint.transaction,
  ])

  // create liquidity position snapshot
  createLiquidityPositionSnapshot(liquidityPosition, event.block)

  // update day data
  updateDayData(event)

  // update pair day data
  updatePairDayData(event)

  // update pair hour data
  updatePairHourData(event)

  // update token0 day data
  updateTokenDayData(token0 as Token, event)

  // update token1 day data
  updateTokenDayData(token1 as Token, event)
}

export function onBurn(event: BurnEvent): void {
  const transaction = Transaction.load(event.transaction.hash.toHex())
  const burns = transaction.burns
  const burn = Burn.load(burns[burns.length - 1])

  const pair = Pair.load(event.address.toHex())
  const factory = getFactory()

  //update token info
  const token0 = Token.load(pair.token0)
  const token1 = Token.load(pair.token1)
  const token0Amount = convertTokenToDecimal(event.params.amount0, token0.decimals)
  const token1Amount = convertTokenToDecimal(event.params.amount1, token1.decimals)

  // update txn counts
  token0.txCount = token0.txCount.plus(BigInt.fromI32(1))
  token1.txCount = token1.txCount.plus(BigInt.fromI32(1))

  // get new amounts of USD and ETH for tracking
  const bundle = getBundle()
  const amountTotalUSD = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount))
    .times(bundle.ethPrice)

  // update txn counts
  factory.txCount = factory.txCount.plus(BigInt.fromI32(1))
  pair.txCount = pair.txCount.plus(BigInt.fromI32(1))

  // update global counter and save
  token0.save()
  token1.save()
  pair.save()
  factory.save()

  // update burn
  // burn.sender = event.params.sender
  burn.amount0 = token0Amount as BigDecimal
  burn.amount1 = token1Amount as BigDecimal
  // burn.to = event.params.to
  burn.logIndex = event.logIndex

  burn.amountUSD = amountTotalUSD as BigDecimal
  burn.save()

  // update the LP position
  const liquidityPosition = createLiquidityPosition(burn.sender as Address, event.address, event.block)

  const mintDays = event.block.timestamp.minus(liquidityPosition.lastMint).divDecimal(BigDecimal.fromString('86400'))
  const burnDays = event.block.timestamp.minus(liquidityPosition.lastBurn).divDecimal(BigDecimal.fromString('86400'))

  liquidityPosition.liquidityTokenBurned = liquidityPosition.liquidityTokenBurned.plus(burn.liquidity)
  liquidityPosition.burnCount = liquidityPosition.burnCount.plus(BigInt.fromI32(1))

  const lca = liquidityPosition.lca
    .plus(mintDays.times(liquidityPosition.liquidityTokenBalance))
    .div(liquidityPosition.burnCount.toBigDecimal())

  const lcad = liquidityPosition.lcad
    .plus(burnDays.times(burn.liquidity))
    .div(liquidityPosition.burnCount.toBigDecimal())

  log.info('BURN lca {} lcad {} liquidity token balance {} mintDays {} burnDays {} mint ts diff {} burn ts diff {}', [
    lca.toString(),
    lcad.toString(),
    liquidityPosition.liquidityTokenBalance.toString(),
    mintDays.toString(),
    burnDays.toString(),
    event.block.timestamp.minus(liquidityPosition.lastMint).toString(),
    event.block.timestamp.minus(liquidityPosition.lastBurn).toString(),
  ])

  liquidityPosition.lca = lca
  liquidityPosition.lcad = lcad

  liquidityPosition.lastBurn = event.block.timestamp

  liquidityPosition.save()

  log.info('{} burned {} slp tokens for pool {} in recieved token0: {} {} token1: {} {} tx: {}', [
    burn.sender.toHex(),
    burn.liquidity.toString(),
    pair.name,
    token0Amount.toString(),
    token0.name,
    token1Amount.toString(),
    token1.name,
    burn.transaction,
  ])

  createLiquidityPositionSnapshot(liquidityPosition, event.block)

  // update day data
  updateDayData(event)

  // update pair day data
  updatePairDayData(event)

  // update pair hour data
  updatePairHourData(event)

  // update token0 day data
  updateTokenDayData(token0 as Token, event)

  // update token1 day data
  updateTokenDayData(token1 as Token, event)
}

export function onSwap(event: SwapEvent): void {
  const pair = Pair.load(event.address.toHex())
  const token0 = Token.load(pair.token0)
  const token1 = Token.load(pair.token1)
  const amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals)
  const amount1In = convertTokenToDecimal(event.params.amount1In, token1.decimals)
  const amount0Out = convertTokenToDecimal(event.params.amount0Out, token0.decimals)
  const amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals)

  // totals for volume updates
  const amount0Total = amount0Out.plus(amount0In)
  const amount1Total = amount1Out.plus(amount1In)

  // ETH/USD prices
  const bundle = getBundle()

  // get total amounts of derived USD and ETH for tracking
  const derivedAmountETH = token1.derivedETH
    .times(amount1Total)
    .plus(token0.derivedETH.times(amount0Total))
    .div(BigDecimal.fromString('2'))
  const derivedAmountUSD = derivedAmountETH.times(bundle.ethPrice)

  // only accounts for volume through white listed tokens
  const trackedAmountUSD = getTrackedVolumeUSD(
    amount0Total,
    token0 as Token,
    amount1Total,
    token1 as Token,
    pair as Pair
  )

  let trackedAmountETH: BigDecimal

  if (bundle.ethPrice.equals(ZERO_BIG_DECIMAL)) {
    trackedAmountETH = ZERO_BIG_DECIMAL
  } else {
    trackedAmountETH = trackedAmountUSD.div(bundle.ethPrice)
  }

  // update token0 global volume and token liquidity stats
  token0.volume = token0.volume.plus(amount0In.plus(amount0Out))
  token0.volumeUSD = token0.volumeUSD.plus(trackedAmountUSD)
  token0.untrackedVolumeUSD = token0.untrackedVolumeUSD.plus(derivedAmountUSD)

  // update token1 global volume and token liquidity stats
  token1.volume = token1.volume.plus(amount1In.plus(amount1Out))
  token1.volumeUSD = token1.volumeUSD.plus(trackedAmountUSD)
  token1.untrackedVolumeUSD = token1.untrackedVolumeUSD.plus(derivedAmountUSD)

  // update txn counts
  token0.txCount = token0.txCount.plus(BigInt.fromI32(1))
  token1.txCount = token1.txCount.plus(BigInt.fromI32(1))

  // update pair volume data, use tracked amount if we have it as its probably more accurate
  pair.volumeUSD = pair.volumeUSD.plus(trackedAmountUSD)
  pair.volumeToken0 = pair.volumeToken0.plus(amount0Total)
  pair.volumeToken1 = pair.volumeToken1.plus(amount1Total)
  pair.untrackedVolumeUSD = pair.untrackedVolumeUSD.plus(derivedAmountUSD)
  pair.txCount = pair.txCount.plus(BigInt.fromI32(1))
  pair.save()

  // update global values, only used tracked amounts for volume
  const factory = getFactory()
  factory.volumeUSD = factory.volumeUSD.plus(trackedAmountUSD)
  factory.volumeETH = factory.volumeETH.plus(trackedAmountETH)
  factory.untrackedVolumeUSD = factory.untrackedVolumeUSD.plus(derivedAmountUSD)
  factory.txCount = factory.txCount.plus(BigInt.fromI32(1))

  // save entities
  pair.save()
  token0.save()
  token1.save()
  factory.save()

  let transaction = Transaction.load(event.transaction.hash.toHex())

  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHex())
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = []
    transaction.swaps = []
    transaction.burns = []
  }

  const swaps = transaction.swaps

  const swap = new Swap(event.transaction.hash.toHex().concat('-').concat(BigInt.fromI32(swaps.length).toString()))

  // update swap event
  swap.pair = pair.id
  swap.timestamp = transaction.timestamp
  swap.transaction = transaction.id
  swap.sender = event.params.sender
  swap.amount0In = amount0In
  swap.amount1In = amount1In
  swap.amount0Out = amount0Out
  swap.amount1Out = amount1Out
  swap.to = event.params.to
  swap.logIndex = event.logIndex
  // use the tracked amount if we have it
  swap.amountUSD = trackedAmountUSD == ZERO_BIG_DECIMAL ? derivedAmountUSD : trackedAmountUSD
  swap.save()

  // update the transaction
  transaction.swaps = transaction.swaps.concat([swap.id])

  transaction.save()

  const dayData = updateDayData(event)

  const pairDayData = updatePairDayData(event)
  const pairHourData = updatePairHourData(event)

  const token0DayData = updateTokenDayData(token0 as Token, event)
  const token1DayData = updateTokenDayData(token1 as Token, event)

  // swap specific updating
  dayData.volumeUSD = dayData.volumeUSD.plus(trackedAmountUSD)
  dayData.volumeETH = dayData.volumeETH.plus(trackedAmountETH)
  dayData.untrackedVolume = dayData.untrackedVolume.plus(derivedAmountUSD)
  dayData.save()

  // swap specific updating for pair
  pairDayData.volumeToken0 = pairDayData.volumeToken0.plus(amount0Total)
  pairDayData.volumeToken1 = pairDayData.volumeToken1.plus(amount1Total)
  pairDayData.volumeUSD = pairDayData.volumeUSD.plus(trackedAmountUSD)
  pairDayData.save()

  // update hourly pair data
  pairHourData.volumeToken0 = pairHourData.volumeToken0.plus(amount0Total)
  pairHourData.volumeToken1 = pairHourData.volumeToken1.plus(amount1Total)
  pairHourData.volumeUSD = pairHourData.volumeUSD.plus(trackedAmountUSD)
  pairHourData.save()

  // swap specific updating for token0
  token0DayData.volume = token0DayData.volume.plus(amount0Total)
  token0DayData.volumeETH = token0DayData.volumeETH.plus(amount0Total.times(token1.derivedETH as BigDecimal))
  token0DayData.volumeUSD = token0DayData.volumeUSD.plus(
    amount0Total.times(token0.derivedETH as BigDecimal).times(bundle.ethPrice)
  )
  token0DayData.save()

  // swap specific updating
  token1DayData.volume = token1DayData.volume.plus(amount1Total)
  token1DayData.volumeETH = token1DayData.volumeETH.plus(amount1Total.times(token1.derivedETH as BigDecimal))
  token1DayData.volumeUSD = token1DayData.volumeUSD.plus(
    amount1Total.times(token1.derivedETH as BigDecimal).times(bundle.ethPrice)
  )
  token1DayData.save()
}

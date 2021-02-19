import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ZERO,
  BIG_INT_ZERO,
  SWIPE_BAR_ADDRESS,
  SWIPE_TOKEN_ADDRESS,
  SWIPE_USDT_PAIR_ADDRESS,
} from './constants'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { Bar, History, User } from '../generated/schema'
import { Bar as BarContract, Transfer as TransferEvent } from '../generated/SwipeBar/Bar'

import { Pair as PairContract } from '../generated/SwipeBar/Pair'
import { SwipeToken as SwipeTokenContract } from '../generated/SwipeBar/SwipeToken'

// TODO: Get averages of multiple swipe stablecoin pairs
function getSwipePrice(): BigDecimal {
  const pair = PairContract.bind(SWIPE_USDT_PAIR_ADDRESS)
  const reserves = pair.getReserves()
  return reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal()).div(BIG_DECIMAL_1E6)
}

function createBar(block: ethereum.Block): Bar {
  const contract = BarContract.bind(dataSource.address())
  const bar = new Bar(dataSource.address().toHex())
  bar.decimals = contract.decimals()
  bar.name = contract.name()
  bar.swipe = contract.swipe()
  bar.symbol = contract.symbol()
  bar.totalSupply = BIG_DECIMAL_ZERO
  bar.swipeStaked = BIG_DECIMAL_ZERO
  bar.swipeStakedUSD = BIG_DECIMAL_ZERO
  bar.swipeHarvested = BIG_DECIMAL_ZERO
  bar.swipeHarvestedUSD = BIG_DECIMAL_ZERO
  bar.xSwipeMinted = BIG_DECIMAL_ZERO
  bar.xSwipeBurned = BIG_DECIMAL_ZERO
  bar.xSwipeAge = BIG_DECIMAL_ZERO
  bar.xSwipeAgeDestroyed = BIG_DECIMAL_ZERO
  bar.ratio = BIG_DECIMAL_ZERO
  bar.updatedAt = block.timestamp
  bar.save()

  return bar as Bar
}

function getBar(block: ethereum.Block): Bar {
  let bar = Bar.load(dataSource.address().toHex())

  if (bar === null) {
    bar = createBar(block)
  }

  return bar as Bar
}

function createUser(address: Address, block: ethereum.Block): User {
  const user = new User(address.toHex())

  // Set relation to bar
  user.bar = dataSource.address().toHex()

  user.xSwipe = BIG_DECIMAL_ZERO
  user.xSwipeMinted = BIG_DECIMAL_ZERO
  user.xSwipeBurned = BIG_DECIMAL_ZERO

  user.swipeStaked = BIG_DECIMAL_ZERO
  user.swipeStakedUSD = BIG_DECIMAL_ZERO

  user.swipeHarvested = BIG_DECIMAL_ZERO
  user.swipeHarvestedUSD = BIG_DECIMAL_ZERO

  // In/Out
  user.xSwipeOut = BIG_DECIMAL_ZERO
  user.swipeOut = BIG_DECIMAL_ZERO
  user.usdOut = BIG_DECIMAL_ZERO

  user.xSwipeIn = BIG_DECIMAL_ZERO
  user.swipeIn = BIG_DECIMAL_ZERO
  user.usdIn = BIG_DECIMAL_ZERO

  user.xSwipeAge = BIG_DECIMAL_ZERO
  user.xSwipeAgeDestroyed = BIG_DECIMAL_ZERO

  user.xSwipeOffset = BIG_DECIMAL_ZERO
  user.swipeOffset = BIG_DECIMAL_ZERO
  user.usdOffset = BIG_DECIMAL_ZERO
  user.updatedAt = block.timestamp

  return user as User
}

function getUser(address: Address, block: ethereum.Block): User {
  let user = User.load(address.toHex())

  if (user === null) {
    user = createUser(address, block)
  }

  return user as User
}

function getHistory(block: ethereum.Block): History {
  const day = block.timestamp.toI32() / 86400

  const id = BigInt.fromI32(day).toString()

  let history = History.load(id)

  if (history === null) {
    const date = day * 86400
    history = new History(id)
    history.date = date
    history.timeframe = 'Day'
    history.swipeStaked = BIG_DECIMAL_ZERO
    history.swipeStakedUSD = BIG_DECIMAL_ZERO
    history.swipeHarvested = BIG_DECIMAL_ZERO
    history.swipeHarvestedUSD = BIG_DECIMAL_ZERO
    history.xSwipeAge = BIG_DECIMAL_ZERO
    history.xSwipeAgeDestroyed = BIG_DECIMAL_ZERO
    history.xSwipeMinted = BIG_DECIMAL_ZERO
    history.xSwipeBurned = BIG_DECIMAL_ZERO
    history.xSwipeSupply = BIG_DECIMAL_ZERO
    history.ratio = BIG_DECIMAL_ZERO
  }

  return history as History
}

export function transfer(event: TransferEvent): void {
  // Convert to BigDecimal with 18 places, 1e18.
  const value = event.params.value.divDecimal(BIG_DECIMAL_1E18)

  // If value is zero, do nothing.
  if (value.equals(BIG_DECIMAL_ZERO)) {
    log.warning('Transfer zero value! Value: {} Tx: {}', [
      event.params.value.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  const bar = getBar(event.block)
  const barContract = BarContract.bind(SWIPE_BAR_ADDRESS)

  const swipePrice = getSwipePrice()

  bar.totalSupply = barContract.totalSupply().divDecimal(BIG_DECIMAL_1E18)
  bar.swipeStaked = SwipeTokenContract.bind(SWIPE_TOKEN_ADDRESS)
    .balanceOf(SWIPE_BAR_ADDRESS)
    .divDecimal(BIG_DECIMAL_1E18)
  bar.ratio = bar.swipeStaked.div(bar.totalSupply)

  const what = value.times(bar.ratio)

  // Minted xSwipe
  if (event.params.from == ADDRESS_ZERO) {
    const user = getUser(event.params.to, event.block)

    log.info('{} minted {} xSwipe in exchange for {} swipe - swipeStaked before {} swipeStaked after {}', [
      event.params.to.toHex(),
      value.toString(),
      what.toString(),
      user.swipeStaked.toString(),
      user.swipeStaked.plus(what).toString(),
    ])

    if (user.xSwipe == BIG_DECIMAL_ZERO) {
      log.info('{} entered the bar', [user.id])
      user.bar = bar.id
    }

    user.xSwipeMinted = user.xSwipeMinted.plus(value)

    const swipeStakedUSD = what.times(swipePrice)

    user.swipeStaked = user.swipeStaked.plus(what)
    user.swipeStakedUSD = user.swipeStakedUSD.plus(swipeStakedUSD)

    const days = event.block.timestamp.minus(user.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    const xSwipeAge = days.times(user.xSwipe)

    user.xSwipeAge = user.xSwipeAge.plus(xSwipeAge)

    // Update last
    user.xSwipe = user.xSwipe.plus(value)

    user.updatedAt = event.block.timestamp

    user.save()

    const barDays = event.block.timestamp.minus(bar.updatedAt).divDecimal(BigDecimal.fromString('86400'))
    const barXswipe = bar.xSwipeMinted.minus(bar.xSwipeBurned)
    bar.xSwipeMinted = bar.xSwipeMinted.plus(value)
    bar.xSwipeAge = bar.xSwipeAge.plus(barDays.times(barXswipe))
    bar.swipeStaked = bar.swipeStaked.plus(what)
    bar.swipeStakedUSD = bar.swipeStakedUSD.plus(swipeStakedUSD)
    bar.updatedAt = event.block.timestamp

    const history = getHistory(event.block)
    history.xSwipeAge = bar.xSwipeAge
    history.xSwipeMinted = history.xSwipeMinted.plus(value)
    history.xSwipeSupply = bar.totalSupply
    history.swipeStaked = history.swipeStaked.plus(what)
    history.swipeStakedUSD = history.swipeStakedUSD.plus(swipeStakedUSD)
    history.ratio = bar.ratio
    history.save()
  }

  // Burned xSwipe
  if (event.params.to == ADDRESS_ZERO) {
    log.info('{} burned {} xSwipe', [event.params.from.toHex(), value.toString()])

    const user = getUser(event.params.from, event.block)

    user.xSwipeBurned = user.xSwipeBurned.plus(value)

    user.swipeHarvested = user.swipeHarvested.plus(what)

    const swipeHarvestedUSD = what.times(swipePrice)

    user.swipeHarvestedUSD = user.swipeHarvestedUSD.plus(swipeHarvestedUSD)

    const days = event.block.timestamp.minus(user.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    const xSwipeAge = days.times(user.xSwipe)

    user.xSwipeAge = user.xSwipeAge.plus(xSwipeAge)

    const xSwipeAgeDestroyed = user.xSwipeAge.div(user.xSwipe).times(value)

    user.xSwipeAgeDestroyed = user.xSwipeAgeDestroyed.plus(xSwipeAgeDestroyed)

    // Update xSwipe last
    user.xSwipe = user.xSwipe.minus(value)

    if (user.xSwipe == BIG_DECIMAL_ZERO) {
      log.info('{} left the bar', [user.id])
      user.bar = null
    }

    user.updatedAt = event.block.timestamp

    user.save()

    const barDays = event.block.timestamp.minus(bar.updatedAt).divDecimal(BigDecimal.fromString('86400'))
    const barXswipe = bar.xSwipeMinted.minus(bar.xSwipeBurned)
    bar.xSwipeBurned = bar.xSwipeBurned.plus(value)
    bar.xSwipeAge = bar.xSwipeAge.plus(barDays.times(barXswipe)).minus(xSwipeAgeDestroyed)
    bar.xSwipeAgeDestroyed = bar.xSwipeAgeDestroyed.plus(xSwipeAgeDestroyed)
    bar.swipeHarvested = bar.swipeHarvested.plus(what)
    bar.swipeHarvestedUSD = bar.swipeHarvestedUSD.plus(swipeHarvestedUSD)
    bar.updatedAt = event.block.timestamp

    const history = getHistory(event.block)
    history.xSwipeSupply = bar.totalSupply
    history.xSwipeBurned = history.xSwipeBurned.plus(value)
    history.xSwipeAge = bar.xSwipeAge
    history.xSwipeAgeDestroyed = history.xSwipeAgeDestroyed.plus(xSwipeAgeDestroyed)
    history.swipeHarvested = history.swipeHarvested.plus(what)
    history.swipeHarvestedUSD = history.swipeHarvestedUSD.plus(swipeHarvestedUSD)
    history.ratio = bar.ratio
    history.save()
  }

  // If transfer from address to address and not known xSwipe pools.
  if (event.params.from != ADDRESS_ZERO && event.params.to != ADDRESS_ZERO) {
    log.info('transfered {} xSwipe from {} to {}', [
      value.toString(),
      event.params.from.toHex(),
      event.params.to.toHex(),
    ])

    const fromUser = getUser(event.params.from, event.block)

    const fromUserDays = event.block.timestamp.minus(fromUser.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    // Recalc xSwipe age first
    fromUser.xSwipeAge = fromUser.xSwipeAge.plus(fromUserDays.times(fromUser.xSwipe))
    // Calculate xSwipeAge being transfered
    const xSwipeAgeTranfered = fromUser.xSwipeAge.div(fromUser.xSwipe).times(value)
    // Subtract from xSwipeAge
    fromUser.xSwipeAge = fromUser.xSwipeAge.minus(xSwipeAgeTranfered)
    fromUser.updatedAt = event.block.timestamp

    fromUser.xSwipe = fromUser.xSwipe.minus(value)
    fromUser.xSwipeOut = fromUser.xSwipeOut.plus(value)
    fromUser.swipeOut = fromUser.swipeOut.plus(what)
    fromUser.usdOut = fromUser.usdOut.plus(what.times(swipePrice))

    if (fromUser.xSwipe == BIG_DECIMAL_ZERO) {
      log.info('{} left the bar by transfer OUT', [fromUser.id])
      fromUser.bar = null
    }

    fromUser.save()

    const toUser = getUser(event.params.to, event.block)

    if (toUser.bar === null) {
      log.info('{} entered the bar by transfer IN', [fromUser.id])
      toUser.bar = bar.id
    }

    // Recalculate xSwipe age and add incoming xSwipeAgeTransfered
    const toUserDays = event.block.timestamp.minus(toUser.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    toUser.xSwipeAge = toUser.xSwipeAge.plus(toUserDays.times(toUser.xSwipe)).plus(xSwipeAgeTranfered)
    toUser.updatedAt = event.block.timestamp

    toUser.xSwipe = toUser.xSwipe.plus(value)
    toUser.xSwipeIn = toUser.xSwipeIn.plus(value)
    toUser.swipeIn = toUser.swipeIn.plus(what)
    toUser.usdIn = toUser.usdIn.plus(what.times(swipePrice))

    const difference = toUser.xSwipeIn.minus(toUser.xSwipeOut).minus(toUser.xSwipeOffset)

    // If difference of swipe in - swipe out - offset > 0, then add on the difference
    // in staked swipe based on xSwipe:Swipe ratio at time of reciept.
    if (difference.gt(BIG_DECIMAL_ZERO)) {
      const swipe = toUser.swipeIn.minus(toUser.swipeOut).minus(toUser.swipeOffset)
      const usd = toUser.usdIn.minus(toUser.usdOut).minus(toUser.usdOffset)

      log.info('{} recieved a transfer of {} xSwipe from {}, swipe value of transfer is {}', [
        toUser.id,
        value.toString(),
        fromUser.id,
        what.toString(),
      ])

      toUser.swipeStaked = toUser.swipeStaked.plus(swipe)
      toUser.swipeStakedUSD = toUser.swipeStakedUSD.plus(usd)

      toUser.xSwipeOffset = toUser.xSwipeOffset.plus(difference)
      toUser.swipeOffset = toUser.swipeOffset.plus(swipe)
      toUser.usdOffset = toUser.usdOffset.plus(usd)
    }

    toUser.save()
  }

  bar.save()
}

import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ZERO,
  BIG_INT_ZERO,
  SUSHI_BAR_ADDRESS,
  SUSHI_TOKEN_ADDRESS,
  SUSHI_USDT_PAIR_ADDRESS,
} from 'const'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { Bar, History, User } from '../generated/schema'
import { Bar as BarContract, Transfer as TransferEvent } from '../generated/SushiBar/Bar'

import { Pair as PairContract } from '../generated/SushiBar/Pair'
import { SushiToken as SushiTokenContract } from '../generated/SushiBar/SushiToken'

// TODO: Get averages of multiple sushi stablecoin pairs
function getSushiPrice(): BigDecimal {
  const pair = PairContract.bind(SUSHI_USDT_PAIR_ADDRESS)
  const reserves = pair.getReserves()
  return reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal()).div(BIG_DECIMAL_1E6)
}

function createBar(block: ethereum.Block): Bar {
  const contract = BarContract.bind(dataSource.address())
  const bar = new Bar(dataSource.address().toHex())
  bar.decimals = contract.decimals()
  bar.name = contract.name()
  bar.sushi = contract.sushi()
  bar.symbol = contract.symbol()
  bar.totalSupply = BIG_DECIMAL_ZERO
  bar.sushiStaked = BIG_DECIMAL_ZERO
  bar.sushiStakedUSD = BIG_DECIMAL_ZERO
  bar.sushiHarvested = BIG_DECIMAL_ZERO
  bar.sushiHarvestedUSD = BIG_DECIMAL_ZERO
  bar.xSushiMinted = BIG_DECIMAL_ZERO
  bar.xSushiBurned = BIG_DECIMAL_ZERO
  bar.xSushiAge = BIG_DECIMAL_ZERO
  bar.xSushiAgeDestroyed = BIG_DECIMAL_ZERO
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

  user.xSushi = BIG_DECIMAL_ZERO
  user.xSushiMinted = BIG_DECIMAL_ZERO
  user.xSushiBurned = BIG_DECIMAL_ZERO

  user.sushiStaked = BIG_DECIMAL_ZERO
  user.sushiStakedUSD = BIG_DECIMAL_ZERO

  user.sushiHarvested = BIG_DECIMAL_ZERO
  user.sushiHarvestedUSD = BIG_DECIMAL_ZERO

  // In/Out
  user.xSushiOut = BIG_DECIMAL_ZERO
  user.sushiOut = BIG_DECIMAL_ZERO
  user.usdOut = BIG_DECIMAL_ZERO

  user.xSushiIn = BIG_DECIMAL_ZERO
  user.sushiIn = BIG_DECIMAL_ZERO
  user.usdIn = BIG_DECIMAL_ZERO

  user.xSushiAge = BIG_DECIMAL_ZERO
  user.xSushiAgeDestroyed = BIG_DECIMAL_ZERO

  user.xSushiOffset = BIG_DECIMAL_ZERO
  user.sushiOffset = BIG_DECIMAL_ZERO
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
    history.sushiStaked = BIG_DECIMAL_ZERO
    history.sushiStakedUSD = BIG_DECIMAL_ZERO
    history.sushiHarvested = BIG_DECIMAL_ZERO
    history.sushiHarvestedUSD = BIG_DECIMAL_ZERO
    history.xSushiAge = BIG_DECIMAL_ZERO
    history.xSushiAgeDestroyed = BIG_DECIMAL_ZERO
    history.xSushiMinted = BIG_DECIMAL_ZERO
    history.xSushiBurned = BIG_DECIMAL_ZERO
    history.xSushiSupply = BIG_DECIMAL_ZERO
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
  const barContract = BarContract.bind(SUSHI_BAR_ADDRESS)

  const sushiPrice = getSushiPrice()

  bar.totalSupply = barContract.totalSupply().divDecimal(BIG_DECIMAL_1E18)
  bar.sushiStaked = SushiTokenContract.bind(SUSHI_TOKEN_ADDRESS)
    .balanceOf(SUSHI_BAR_ADDRESS)
    .divDecimal(BIG_DECIMAL_1E18)
  bar.ratio = bar.sushiStaked.div(bar.totalSupply)

  const what = value.times(bar.ratio)

  // Minted xSushi
  if (event.params.from == ADDRESS_ZERO) {
    const user = getUser(event.params.to, event.block)

    log.info('{} minted {} xSushi in exchange for {} sushi - sushiStaked before {} sushiStaked after {}', [
      event.params.to.toHex(),
      value.toString(),
      what.toString(),
      user.sushiStaked.toString(),
      user.sushiStaked.plus(what).toString(),
    ])

    if (user.xSushi == BIG_DECIMAL_ZERO) {
      log.info('{} entered the bar', [user.id])
      user.bar = bar.id
    }

    user.xSushiMinted = user.xSushiMinted.plus(value)

    const sushiStakedUSD = what.times(sushiPrice)

    user.sushiStaked = user.sushiStaked.plus(what)
    user.sushiStakedUSD = user.sushiStakedUSD.plus(sushiStakedUSD)

    const days = event.block.timestamp.minus(user.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    const xSushiAge = days.times(user.xSushi)

    user.xSushiAge = user.xSushiAge.plus(xSushiAge)

    // Update last
    user.xSushi = user.xSushi.plus(value)

    user.updatedAt = event.block.timestamp

    user.save()

    const barDays = event.block.timestamp.minus(bar.updatedAt).divDecimal(BigDecimal.fromString('86400'))
    const barXsushi = bar.xSushiMinted.minus(bar.xSushiBurned)
    bar.xSushiMinted = bar.xSushiMinted.plus(value)
    bar.xSushiAge = bar.xSushiAge.plus(barDays.times(barXsushi))
    bar.sushiStaked = bar.sushiStaked.plus(what)
    bar.sushiStakedUSD = bar.sushiStakedUSD.plus(sushiStakedUSD)
    bar.updatedAt = event.block.timestamp

    const history = getHistory(event.block)
    history.xSushiAge = bar.xSushiAge
    history.xSushiMinted = history.xSushiMinted.plus(value)
    history.xSushiSupply = bar.totalSupply
    history.sushiStaked = history.sushiStaked.plus(what)
    history.sushiStakedUSD = history.sushiStakedUSD.plus(sushiStakedUSD)
    history.ratio = bar.ratio
    history.save()
  }

  // Burned xSushi
  if (event.params.to == ADDRESS_ZERO) {
    log.info('{} burned {} xSushi', [event.params.from.toHex(), value.toString()])

    const user = getUser(event.params.from, event.block)

    user.xSushiBurned = user.xSushiBurned.plus(value)

    user.sushiHarvested = user.sushiHarvested.plus(what)

    const sushiHarvestedUSD = what.times(sushiPrice)

    user.sushiHarvestedUSD = user.sushiHarvestedUSD.plus(sushiHarvestedUSD)

    const days = event.block.timestamp.minus(user.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    const xSushiAge = days.times(user.xSushi)

    user.xSushiAge = user.xSushiAge.plus(xSushiAge)

    const xSushiAgeDestroyed = user.xSushiAge.div(user.xSushi).times(value)

    user.xSushiAgeDestroyed = user.xSushiAgeDestroyed.plus(xSushiAgeDestroyed)

    // remove xSushiAge
    user.xSushiAge = user.xSushiAge.minus(xSushiAgeDestroyed)
    // Update xSushi last
    user.xSushi = user.xSushi.minus(value)

    if (user.xSushi == BIG_DECIMAL_ZERO) {
      log.info('{} left the bar', [user.id])
      user.bar = null
    }

    user.updatedAt = event.block.timestamp

    user.save()

    const barDays = event.block.timestamp.minus(bar.updatedAt).divDecimal(BigDecimal.fromString('86400'))
    const barXsushi = bar.xSushiMinted.minus(bar.xSushiBurned)
    bar.xSushiBurned = bar.xSushiBurned.plus(value)
    bar.xSushiAge = bar.xSushiAge.plus(barDays.times(barXsushi)).minus(xSushiAgeDestroyed)
    bar.xSushiAgeDestroyed = bar.xSushiAgeDestroyed.plus(xSushiAgeDestroyed)
    bar.sushiHarvested = bar.sushiHarvested.plus(what)
    bar.sushiHarvestedUSD = bar.sushiHarvestedUSD.plus(sushiHarvestedUSD)
    bar.updatedAt = event.block.timestamp

    const history = getHistory(event.block)
    history.xSushiSupply = bar.totalSupply
    history.xSushiBurned = history.xSushiBurned.plus(value)
    history.xSushiAge = bar.xSushiAge
    history.xSushiAgeDestroyed = history.xSushiAgeDestroyed.plus(xSushiAgeDestroyed)
    history.sushiHarvested = history.sushiHarvested.plus(what)
    history.sushiHarvestedUSD = history.sushiHarvestedUSD.plus(sushiHarvestedUSD)
    history.ratio = bar.ratio
    history.save()
  }

  // If transfer from address to address and not known xSushi pools.
  if (event.params.from != ADDRESS_ZERO && event.params.to != ADDRESS_ZERO) {
    log.info('transfered {} xSushi from {} to {}', [
      value.toString(),
      event.params.from.toHex(),
      event.params.to.toHex(),
    ])

    const fromUser = getUser(event.params.from, event.block)

    const fromUserDays = event.block.timestamp.minus(fromUser.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    // Recalc xSushi age first
    fromUser.xSushiAge = fromUser.xSushiAge.plus(fromUserDays.times(fromUser.xSushi))
    // Calculate xSushiAge being transfered
    const xSushiAgeTranfered = fromUser.xSushiAge.div(fromUser.xSushi).times(value)
    // Subtract from xSushiAge
    fromUser.xSushiAge = fromUser.xSushiAge.minus(xSushiAgeTranfered)
    fromUser.updatedAt = event.block.timestamp

    fromUser.xSushi = fromUser.xSushi.minus(value)
    fromUser.xSushiOut = fromUser.xSushiOut.plus(value)
    fromUser.sushiOut = fromUser.sushiOut.plus(what)
    fromUser.usdOut = fromUser.usdOut.plus(what.times(sushiPrice))

    if (fromUser.xSushi == BIG_DECIMAL_ZERO) {
      log.info('{} left the bar by transfer OUT', [fromUser.id])
      fromUser.bar = null
    }

    fromUser.save()

    const toUser = getUser(event.params.to, event.block)

    if (toUser.bar === null) {
      log.info('{} entered the bar by transfer IN', [fromUser.id])
      toUser.bar = bar.id
    }

    // Recalculate xSushi age and add incoming xSushiAgeTransfered
    const toUserDays = event.block.timestamp.minus(toUser.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    toUser.xSushiAge = toUser.xSushiAge.plus(toUserDays.times(toUser.xSushi)).plus(xSushiAgeTranfered)
    toUser.updatedAt = event.block.timestamp

    toUser.xSushi = toUser.xSushi.plus(value)
    toUser.xSushiIn = toUser.xSushiIn.plus(value)
    toUser.sushiIn = toUser.sushiIn.plus(what)
    toUser.usdIn = toUser.usdIn.plus(what.times(sushiPrice))

    const difference = toUser.xSushiIn.minus(toUser.xSushiOut).minus(toUser.xSushiOffset)

    // If difference of sushi in - sushi out - offset > 0, then add on the difference
    // in staked sushi based on xSushi:Sushi ratio at time of reciept.
    if (difference.gt(BIG_DECIMAL_ZERO)) {
      const sushi = toUser.sushiIn.minus(toUser.sushiOut).minus(toUser.sushiOffset)
      const usd = toUser.usdIn.minus(toUser.usdOut).minus(toUser.usdOffset)

      log.info('{} recieved a transfer of {} xSushi from {}, sushi value of transfer is {}', [
        toUser.id,
        value.toString(),
        fromUser.id,
        what.toString(),
      ])

      toUser.sushiStaked = toUser.sushiStaked.plus(sushi)
      toUser.sushiStakedUSD = toUser.sushiStakedUSD.plus(usd)

      toUser.xSushiOffset = toUser.xSushiOffset.plus(difference)
      toUser.sushiOffset = toUser.sushiOffset.plus(sushi)
      toUser.usdOffset = toUser.usdOffset.plus(usd)
    }

    toUser.save()
  }

  bar.save()
}

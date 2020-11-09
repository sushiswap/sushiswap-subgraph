import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ZERO,
  SUSHIBAR_ADDRESS,
  SUSHI_TOKEN_ADDRESS,
  SUSHI_USDT_PAIR_ADDRESS,
} from './constants'
import { Address, BigDecimal, dataSource, log } from '@graphprotocol/graph-ts'
import { Bar, User } from '../generated/schema'
import { Bar as BarContract, Transfer as TransferEvent } from '../generated/SushiBar/Bar'

import { Pair as PairContract } from '../generated/SushiBar/Pair'
import { SushiToken as SushiTokenContract } from '../generated/SushiBar/SushiToken'

// TODO: Get averages of multiple sushi stablecoin pairs
function getSushiPrice(): BigDecimal {
  const pair = PairContract.bind(SUSHI_USDT_PAIR_ADDRESS)
  const reserves = pair.getReserves()
  return reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal()).div(BIG_DECIMAL_1E6)
}

function createBar(): Bar {
  const contract = BarContract.bind(dataSource.address())
  const bar = new Bar(dataSource.address().toHex())
  bar.decimals = contract.decimals()
  bar.name = contract.name()
  bar.sushi = contract.sushi()
  bar.symbol = contract.symbol()
  bar.totalSupply = BIG_DECIMAL_ZERO
  bar.staked = BIG_DECIMAL_ZERO
  bar.ratio = BIG_DECIMAL_ZERO
  bar.save()

  return bar as Bar
}

function getBar(): Bar {
  let bar = Bar.load(dataSource.address().toHex())

  if (bar === null) {
    bar = createBar()
  }

  return bar as Bar
}

function createUser(address: Address): User {
  const user = new User(address.toHex())

  // Set relation to bar
  user.bar = dataSource.address().toHex()

  user.xSushi = BIG_DECIMAL_ZERO
  user.staked = BIG_DECIMAL_ZERO
  user.stakedUSD = BIG_DECIMAL_ZERO
  user.harvested = BIG_DECIMAL_ZERO
  user.harvestedUSD = BIG_DECIMAL_ZERO

  return user as User
}

function getUser(address: Address): User {
  let user = User.load(address.toHex())

  if (user === null) {
    user = createUser(address)
  }

  return user as User
}

export function transfer(event: TransferEvent): void {
  const bar = getBar()
  const barContract = BarContract.bind(SUSHIBAR_ADDRESS)

  bar.totalSupply = barContract.totalSupply().divDecimal(BIG_DECIMAL_1E18)
  bar.staked = SushiTokenContract.bind(SUSHI_TOKEN_ADDRESS).balanceOf(SUSHIBAR_ADDRESS).divDecimal(BIG_DECIMAL_1E18)
  bar.ratio = bar.staked.div(bar.totalSupply)

  bar.save()

  const value = event.params.value.divDecimal(BIG_DECIMAL_1E18)

  // Minted xSushi
  if (event.params.from == ADDRESS_ZERO) {
    const what = value.times(bar.ratio)

    // log.info('{} minted {} xSushi in exchange for {} sushi', [
    //   event.params.to.toHex(),
    //   value.toString(),
    //   what.toString(),
    // ])

    const user = getUser(event.params.to)

    if (user.xSushi == BIG_DECIMAL_ZERO) {
      user.bar = bar.id
    }

    user.xSushi = user.xSushi.plus(value)
    user.staked = user.staked.plus(what)
    user.stakedUSD = user.stakedUSD.plus(what.times(getSushiPrice()))
    user.save()

    log.info('enter staked db: {} contract: {}', [
      bar.staked.toString(),
      SushiTokenContract.bind(SUSHI_TOKEN_ADDRESS).balanceOf(SUSHIBAR_ADDRESS).divDecimal(BIG_DECIMAL_1E18).toString(),
    ])

    log.info('enter total supply db: {} contract: {}', [
      bar.totalSupply.toString(),
      BarContract.bind(SUSHIBAR_ADDRESS).totalSupply().divDecimal(BIG_DECIMAL_1E18).toString(),
    ])
  }

  // Burned xSushi
  if (event.params.to == ADDRESS_ZERO) {
    // log.info('{} burned {} xSushi', [event.params.from.toHex(), value.toString()])

    const user = getUser(event.params.from)

    user.xSushi = user.xSushi.minus(value)

    const what = value.times(bar.ratio)

    user.harvested = user.harvested.plus(what)

    user.harvestedUSD = user.harvestedUSD.plus(what.times(getSushiPrice()))

    if (user.xSushi == BIG_DECIMAL_ZERO) {
      user.bar = null
    }

    user.save()
  }

  // If transfer from address to address and not known xSushi pools.
  if (event.params.from != ADDRESS_ZERO && event.params.to != ADDRESS_ZERO) {
    const fromUser = getUser(event.params.from)

    fromUser.xSushi = fromUser.xSushi.minus(value)

    if (fromUser.xSushi == BIG_DECIMAL_ZERO) {
      fromUser.bar = null
    }

    fromUser.save()

    const toUser = getUser(event.params.to)

    if (toUser.bar === null) {
      toUser.bar = bar.id
    }

    toUser.xSushi = toUser.xSushi.plus(value)

    toUser.save()
  }
}

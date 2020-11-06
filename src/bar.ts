import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  SUSHIBAR_ADDRESS,
  SUSHI_MAKER_ADDRESS,
  SUSHI_TOKEN_ADDRESS,
  SUSHI_USDT_PAIR_ADDRESS,
  ZERO_BIG_DECIMAL,
} from './constants'
import { Address, BigDecimal, dataSource, log } from '@graphprotocol/graph-ts'
import { Bar, User } from '../generated/schema'
import { Bar as BarContract, EnterCall, LeaveCall, Transfer as TransferEvent } from '../generated/SushiBar/Bar'

import { Pair as PairContract } from '../generated/SushiBar/Pair'
import { SushiToken as SushiTokenContract } from '../generated/SushiBar/SushiToken'

function getSushiPrice(): BigDecimal {
  const pair = PairContract.bind(SUSHI_USDT_PAIR_ADDRESS)
  const reserves = pair.getReserves()
  return reserves.value1
    .toBigDecimal()
    .times(BIG_DECIMAL_1E18)
    .div(reserves.value0.toBigDecimal())
    .div(BigDecimal.fromString('1000000'))
}

function createBar(): Bar {
  const contract = BarContract.bind(dataSource.address())
  const bar = new Bar(dataSource.address().toHex())
  bar.decimals = contract.decimals()
  bar.name = contract.name()
  bar.sushi = contract.sushi()
  bar.symbol = contract.symbol()
  bar.totalSupply = contract.totalSupply().divDecimal(BIG_DECIMAL_1E18)
  bar.staked = ZERO_BIG_DECIMAL
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

function updateBar(bar: Bar): Bar {
  const barContract = BarContract.bind(dataSource.address())
  const sushiTokenContract = SushiTokenContract.bind(SUSHI_TOKEN_ADDRESS)
  bar.totalSupply = barContract.totalSupply().divDecimal(BIG_DECIMAL_1E18)
  bar.staked = sushiTokenContract.balanceOf(barContract._address).divDecimal(BIG_DECIMAL_1E18)
  bar.save()
  return bar as Bar
}

function getUser(address: Address): User {
  let user = User.load(address.toHex())

  if (user === null) {
    user = new User(address.toHex())

    // Set relation to bar
    user.bar = dataSource.address().toHex()

    user.xSushi = ZERO_BIG_DECIMAL
    user.staked = ZERO_BIG_DECIMAL
    user.stakedUSD = ZERO_BIG_DECIMAL
    user.harvested = ZERO_BIG_DECIMAL
    user.harvestedUSD = ZERO_BIG_DECIMAL

    user.save()
  }

  return user as User
}

export function transfer(event: TransferEvent): void {
  // Sending xSushi to user
  if (event.params.from == ADDRESS_ZERO) {
    log.info('{} sent {} xSushi to {}', [
      event.params.from.toHex(),
      event.params.value.toString(),
      event.params.to.toHex(),
    ])
  }

  // User removed xSushi
  if (event.params.to == ADDRESS_ZERO) {
    log.info('{} removed {} xSushi', [
      event.params.from.toHex(),
      event.params.value.toString(),
      event.params.to.toHex(),
    ])
  }

  // If transfer to another user
  if (event.params.from != ADDRESS_ZERO && event.params.to != ADDRESS_ZERO) {
    log.info('user {} transfered {} xSushi to user {}', [
      event.params.from.toHex(),
      event.params.value.toString(),
      event.params.to.toHex(),
    ])

    // TODO: We should consider if we update the harvested value on the to user at the time of sending
    const value = event.params.value.divDecimal(BIG_DECIMAL_1E18)
    const fromUser = getUser(event.params.from)
    fromUser.xSushi = fromUser.xSushi.minus(value)
    fromUser.save()

    // TODO: We should consider if we update the staked value on the to user at the time of recipt
    const toUser = getUser(event.params.to)
    toUser.xSushi = fromUser.xSushi.plus(value)
    toUser.save()
  }
}

export function enter(call: EnterCall): void {
  const amount = call.inputs._amount.divDecimal(BIG_DECIMAL_1E18)

  log.info('{} entered the bar and staked {} sushi', [call.from.toHex(), amount.toString()])

  const bar = updateBar(getBar())

  let xSushi: BigDecimal

  if (bar.totalSupply == ZERO_BIG_DECIMAL || bar.staked == ZERO_BIG_DECIMAL) {
    xSushi = amount
  } else {
    // int256 what = _amount.mul(totalShares).div(totalSushi);
    xSushi = amount.times(bar.totalSupply).div(bar.staked)
  }

  const user = getUser(call.from)

  user.xSushi = user.xSushi.plus(xSushi)

  user.staked = user.staked.plus(amount)

  const sushiPrice = getSushiPrice()

  user.stakedUSD = user.stakedUSD.plus(amount.times(sushiPrice))

  user.save()
}

export function leave(call: LeaveCall): void {
  const share = call.inputs._share.divDecimal(BIG_DECIMAL_1E18)

  const bar = updateBar(getBar())

  const user = getUser(call.from)

  user.xSushi = user.xSushi.minus(share)

  // _share.mul(sushi.balanceOf(address(this))).div(totalShares);
  const harvesting = share.times(bar.staked).div(bar.totalSupply)

  user.harvested = user.harvested.plus(harvesting)

  const sushiPrice = getSushiPrice()

  user.harvestedUSD = user.harvestedUSD.plus(harvesting.times(sushiPrice))

  if (user.xSushi == ZERO_BIG_DECIMAL) {
    // If user xSushi is zero, remove from bar.
    user.bar = null
    user.save()
  }

  user.save()

  log.info('{} left the bar and harvested {} sushi in exchange for {} xSushi', [
    call.from.toHex(),
    user.harvested.toString(),
    share.toString(),
  ])
}

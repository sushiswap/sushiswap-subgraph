import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  BIG_INT_ZERO,
  SUSHIBAR_ADDRESS,
  SUSHI_MAKER_ADDRESS,
  SUSHI_TOKEN_ADDRESS,
  SUSHI_USDT_PAIR_ADDRESS,
  XSUSHI_USDC_PAIR_ADDRESS,
  XSUSHI_WETH_PAIR_ADDRESS,
} from './constants'
import { Address, BigDecimal, BigInt, dataSource, log } from '@graphprotocol/graph-ts'
import { Bar, User } from '../generated/schema'
import { Bar as BarContract, EnterCall, LeaveCall, Transfer as TransferEvent } from '../generated/SushiBar/Bar'

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
  bar.stakedSushi = BIG_DECIMAL_ZERO
  bar.ratio = BIG_DECIMAL_ZERO
  bar.sushiUSD = BIG_DECIMAL_ZERO
  bar.stakedUSD = BIG_DECIMAL_ZERO
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

  const value = event.params.value.divDecimal(BIG_DECIMAL_1E18)

  // update Bar
  const contract = BarContract.bind(dataSource.address())
  bar.totalSupply = contract.totalSupply().divDecimal(BIG_DECIMAL_1E18)
  bar.stakedSushi = SushiTokenContract.bind(SUSHI_TOKEN_ADDRESS).balanceOf(SUSHIBAR_ADDRESS).divDecimal(BIG_DECIMAL_1E18)
  bar.ratio = bar.stakedSushi / bar.totalSupply
  bar.sushiUSD = getSushiPrice()
  bar.stakedUSD = bar.stakedSushi * bar.sushiUSD
  bar.save()

  // update each address in event
  if (event.params.from != ADDRESS_ZERO) {
    const user = getUser(event.params.from)
    user.xSushi = contract.balanceOf(event.params.from).divDecimal(BIG_DECIMAL_1E18)
    user.save()
  }

  if (event.params.to != ADDRESS_ZERO) {
    const user = getUser(event.params.to)
    user.xSushi = contract.balanceOf(event.params.to).divDecimal(BIG_DECIMAL_1E18)
    user.save()
  }
}

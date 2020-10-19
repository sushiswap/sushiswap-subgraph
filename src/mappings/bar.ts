import { Bar, UserBar } from '../../generated/schema'
import { Bar as BarContract, EnterCall, LeaveCall } from '../../generated/SushiBar/Bar'
import { BigDecimal, log } from '@graphprotocol/graph-ts'
import { NUMBER_LITERAL_1E18, SUSHIBAR_ADDRESS, SUSHITOKEN_ADDRESS, ZERO_BIG_DECIMAL } from '../constants'

import { SushiToken as SushiTokenContract } from '../../generated/MasterChef/SushiToken'
import { getSushiPrice } from '../pricing'
import { getUser } from '../entities'

function createBar(): Bar {
  const contract = BarContract.bind(SUSHIBAR_ADDRESS)
  const bar = new Bar(SUSHIBAR_ADDRESS.toHex())
  bar.decimals = contract.decimals()
  bar.name = contract.name()
  bar.sushi = contract.sushi().toHex()
  bar.symbol = contract.symbol()
  bar.totalSupply = contract.totalSupply().divDecimal(NUMBER_LITERAL_1E18)
  bar.stakedSushi = ZERO_BIG_DECIMAL
  bar.save()

  return bar as Bar
}

function getBar(): Bar {
  let bar = Bar.load(SUSHIBAR_ADDRESS.toHex())

  if (bar === null) {
    bar = createBar()
  }

  return bar as Bar
}

function updateBar(bar: Bar): Bar {
  const barContract = BarContract.bind(SUSHIBAR_ADDRESS)
  const sushiTokenContract = SushiTokenContract.bind(SUSHITOKEN_ADDRESS)
  bar.totalSupply = barContract.totalSupply().divDecimal(NUMBER_LITERAL_1E18)
  bar.stakedSushi = sushiTokenContract.balanceOf(barContract._address).divDecimal(NUMBER_LITERAL_1E18)
  bar.save()
  return bar as Bar
}

export function enter(call: EnterCall): void {
  const amount = call.inputs._amount.divDecimal(NUMBER_LITERAL_1E18)

  const bar = updateBar(getBar())

  let xSushi: BigDecimal

  if (bar.totalSupply == ZERO_BIG_DECIMAL || bar.stakedSushi == ZERO_BIG_DECIMAL) {
    xSushi = amount
  } else {
    // int256 what = _amount.mul(totalShares).div(totalSushi);
    xSushi = amount.times(bar.totalSupply).div(bar.stakedSushi)
  }
  
  const user = getUser(call.from)

  const userBarId = user.id.concat("-").concat(bar.id)

  let userBar = UserBar.load(userBarId)

  if (userBar == null) {
    userBar = new UserBar(userBarId)
    user.bar = userBarId
    user.save()
  }

  userBar.xSushi = userBar.xSushi.plus(xSushi)
  
  userBar.staked = userBar.staked.plus(amount)
  
  const sushiPrice = getSushiPrice()
  
  userBar.stakedUSD = userBar.stakedUSD.plus(amount.times(sushiPrice))

  userBar.save()
}

export function leave(call: LeaveCall): void {
  log.info('{} left the bar and harvested {} sushi', [
    call.from.toHex(),
    call.inputs._share.divDecimal(NUMBER_LITERAL_1E18).toString(),
  ])

  const share = call.inputs._share.divDecimal(NUMBER_LITERAL_1E18)

  const bar = updateBar(getBar())
  
  const user = getUser(call.from)

  const userBarId = user.id.concat("-").concat(bar.id)
  const userBar = UserBar.load(userBarId)

  userBar.xSushi = userBar.xSushi.minus(share)

  // _share.mul(sushi.balanceOf(address(this))).div(totalShares);
  const harvesting = share.times(bar.stakedSushi).div(bar.totalSupply)

  userBar.harvested = userBar.harvested.plus(harvesting)

  const sushiPrice = getSushiPrice()
  
  userBar.harvestedUSD = userBar.harvestedUSD.plus(harvesting.times(sushiPrice))

  if (userBar.xSushi.equals(ZERO_BIG_DECIMAL)) {
    log.info("User xSushi is 0, remove bar", [])
    user.bar = null
    user.save()
  }

  userBar.save()
}

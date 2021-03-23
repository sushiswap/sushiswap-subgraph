import { BigInt, Address } from '@graphprotocol/graph-ts'
import { SushiDistributor, Claimed } from '../generated/SushiDistributor/SushiDistributor'
import { User, Claim, Week } from '../generated/schema'
import { BIG_DECIMAL_ZERO, BIG_DECIMAL_1E18, BIG_INT_ZERO, SUSHI_DISTRIBUTOR_ADDRESS } from 'const'

export function getUser(address: Address): User {
  let id = address.toHexString()
  let user = User.load(id)

  if (user === null) {
    user = new User(id)
    user.totalClaimed = BIG_DECIMAL_ZERO
    user.save()
  }

  return user as User
}

export function getWeek(weekNumber: BigInt): Week {
  let id = weekNumber.toString()
  let week = Week.load(id)

  if (week === null) {
    let Distributor = SushiDistributor.bind(SUSHI_DISTRIBUTOR_ADDRESS)

    week = new Week(id)
    week.totalClaimed = BIG_DECIMAL_ZERO
    week.numberOfClaims = BIG_INT_ZERO
    week.merkleRoot = Distributor.merkleRoot().toHexString()
    week.save()
  }

  return week as Week
}

export function handleClaimed(event: Claimed): void {
  let claim = new Claim(event.params.account.toHexString() + '-' + event.params.week.toString())
  let user = getUser(event.params.account)

  claim.user = user.id.toString()
  claim.week = event.params.week.toI32()
  claim.amount = event.params.amount.toBigDecimal().div(BIG_DECIMAL_1E18)

  user.totalClaimed = user.totalClaimed.plus(claim.amount)

  claim.save()
  user.save()

  let week = getWeek(event.params.week)

  week.totalClaimed = week.totalClaimed.plus(claim.amount)
  week.numberOfClaims = week.numberOfClaims.plus(BigInt.fromI32(1))

  week.save()
}

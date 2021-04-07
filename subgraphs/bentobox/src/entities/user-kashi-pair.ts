import { Address, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from 'const'
import { UserKashiPair } from '../../generated/schema'
import { KashiPair as KashiPairContract } from '../../generated/BentoBox/KashiPair'


export function createUserKashiPair(user: Address, pair: Address, block: ethereum.Block): UserKashiPair {
  const id = getUserKashiPairId(user, pair)

  const userPair = new UserKashiPair(id)

  userPair.user = user.toHex()
  userPair.pair = pair.toHex()
  userPair.assetFraction = BIG_INT_ZERO
  userPair.collateralShare = BIG_INT_ZERO
  userPair.borrowPart = BIG_INT_ZERO
  userPair.block = block.number
  userPair.timestamp = block.timestamp
  userPair.save()

  return userPair as UserKashiPair
}

export function getUserKashiPair(user: Address, pair: Address, block: ethereum.Block): UserKashiPair {
  let userPair = UserKashiPair.load(getUserKashiPairId(user, pair))

  if (userPair === null) {
    userPair = createUserKashiPair(user, pair, block)
  }

  const kashiPairContract = KashiPairContract.bind(pair)
  userPair.block = block.number
  userPair.timestamp = block.timestamp
  userPair.save()

  return userPair as UserKashiPair
}

function getUserKashiPairId(user: Address, pair: Address): string {
  return user.toHex().concat('-').concat(pair.toHex())
}

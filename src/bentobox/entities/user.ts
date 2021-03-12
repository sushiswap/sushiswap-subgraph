import { Address, ethereum } from '@graphprotocol/graph-ts'

import { User } from '../../../generated/schema'

import { getBentoBox } from './bentobox'

export function getUser(address: Address, block: ethereum.Block): User {
  const bentoBox = getBentoBox()

  const uid = address.toHex()
  let user = User.load(uid)

  if (user === null) {
    user = new User(uid)
    user.bentoBox = bentoBox.id
  }

  user.block = block.number
  user.timestamp = block.timestamp
  user.save()

  return user as User
}

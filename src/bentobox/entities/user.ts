import { Address, ethereum } from '@graphprotocol/graph-ts'

import { User } from '../../../generated/schema'

export function getUser(address: Address, block: ethereum.Block): User {
  const uid = address.toHex()

  let user = User.load(uid)

  if (user === null) {
    user = new User(uid)
    user.block = block.number
    user.timestamp = block.timestamp
    user.save()
  }

  return user as User
}

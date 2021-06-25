import { Address, ethereum } from '@graphprotocol/graph-ts'

import { User } from '../../generated/schema'

export function getUser(address: Address, block: ethereum.Block): User {
  const id = address.toHex()
  
  let user = User.load(id)

  if (user === null) {
    user = new User(id)
    // TODO: Check
    user.eoa = false
    user.createdAtTimestamp = block.timestamp
    user.createdAtBlock = block.number
  }

  user.updatedAtTimestamp = block.timestamp
  user.updatedAtBlock = block.number

  user.save()

  return user as User
}

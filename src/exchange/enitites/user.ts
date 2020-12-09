import { Address, BigInt, log } from '@graphprotocol/graph-ts'

import { User } from '../../../generated/schema'
import { getFactory } from '.'

export function createUser(address: Address): User {
  // Update user count on factory
  const factory = getFactory()
  factory.userCount = factory.userCount.plus(BigInt.fromI32(1))
  factory.save()

  const user = new User(address.toHex())
  user.save()

  return user as User
}

export function getUser(address: Address): User {
  let user = User.load(address.toHex())

  // If no user, create one
  if (user === null) {
    user = createUser(address)
  }

  return user as User
}

export function updateUser(address: Address): User {
  // log.info('Update user {}', [address.toHex()])
  const user = getUser(address)

  return user as User
}

export function updateUsers(addresses: Address[]): void {
  log.info('Update users', [])
  for (let i = 0; i < addresses.length; i++) {
    updateUser(addresses[i])
  }
}

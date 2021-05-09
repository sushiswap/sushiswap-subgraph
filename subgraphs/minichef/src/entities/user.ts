import { User } from '../../generated/schema'
import { BigInt, Address, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO, BIG_INT_ONE, MINI_CHEF_ADDRESS } from 'const'
import { getMiniChef } from './minichef'
import { getPool } from './pool'

export function getUser(address: Address, pid: BigInt, block: ethereum.Block): User {
  const miniChef = getMiniChef(block)
  const pool = getPool(pid, block)

  const uid = address.toHex()
  const id = pid.toString().concat('-').concat(uid)
  let user = User.load(id)

  if (user === null) {
    user = new User(id)
    user.address = address
    user.pool = pool.id
    user.amount = BIG_INT_ZERO
    user.rewardDebt = BIG_INT_ZERO
    user.sushiHarvested = BIG_INT_ZERO

    pool.userCount = pool.userCount.plus(BIG_INT_ONE)
    pool.save()
  }

  user.timestamp = block.timestamp
  user.block = block.number
  user.save()

  return user as User
}

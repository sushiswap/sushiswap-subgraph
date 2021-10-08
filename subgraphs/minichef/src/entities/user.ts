import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ONE, BIG_INT_ZERO } from 'const'

import { User } from '../../generated/schema'
import { getPool } from './pool'

export function getUser(address: Address, pid: BigInt, block: ethereum.Block): User {
  const uid = address.toHex()
  const id = pid.toString().concat('-').concat(uid)

  let user = User.load(id)

  if (user === null) {
    const pool = getPool(pid, block)
    user = new User(id)
    user.address = address
    user.pool = pool.id
    user.amount = BIG_INT_ZERO
    user.rewardDebt = BIG_INT_ZERO
    user.sushiHarvested = BIG_INT_ZERO
    user.timestamp = block.timestamp
    user.block = block.number
    user.save()

    pool.userCount = pool.userCount.plus(BIG_INT_ONE)
    pool.save()
  }

  return user as User
}

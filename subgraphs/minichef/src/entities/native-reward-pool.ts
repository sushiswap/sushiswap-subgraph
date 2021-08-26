import { BIG_INT_ZERO } from 'const'
import { BigInt, ethereum } from '@graphprotocol/graph-ts'

import { NativeRewardPool, Rewarder } from '../../generated/schema'

export function getNativeRewardPool(pid: BigInt, rewarder: Rewarder): NativeRewardPool {
  let pool = NativeRewardPool.load(pid.toString())

  if (pool === null) {
    pool = new NativeRewardPool(pid.toString())
    pool.rewarder = rewarder.id
    pool.allocPoint = BIG_INT_ZERO
  }

  pool.save()

  return pool as NativeRewardPool
}

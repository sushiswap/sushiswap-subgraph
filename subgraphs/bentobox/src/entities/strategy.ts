import { Strategy } from '../../generated/schema'
import { LogStrategySet } from '../../generated/BentoBox/BentoBox'
import { getToken } from './token'
import { BIG_INT_ZERO } from 'const'
import { Address } from '@graphprotocol/graph-ts'

export function createStrategy(event: LogStrategySet): Strategy {
  const strategy = new Strategy(event.params.strategy.toHex())

  const token = getToken(event.params.token, event.block)

  strategy.token = event.params.token.toHex()
  strategy.balance = BIG_INT_ZERO 
  strategy.targetPercentage = token.strategyTargetPercentage // Ugly, but can be set before a strategy is in place 
  strategy.totalProfit = BIG_INT_ZERO
  strategy.date = event.block.timestamp
  strategy.block = event.block.number

  strategy.save()

  return strategy as Strategy
}

export function getStrategy(address: Address): Strategy {
  const strategy = Strategy.load(address.toHex())

  return strategy as Strategy
}

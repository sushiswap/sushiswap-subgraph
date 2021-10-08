import { Strategy } from '../../generated/schema'
import { BIG_INT_ZERO } from 'const'
import { Address } from '@graphprotocol/graph-ts'

export function getOrCreateStrategy(_strategy: Address, token: Address): Strategy {
  let strategy = Strategy.load(_strategy.toHex())

  if (strategy === null) {
    strategy = new Strategy(_strategy.toHex())
    strategy.token = token.toHex()
    strategy.balance = BIG_INT_ZERO
    strategy.totalProfit = BIG_INT_ZERO

    strategy.save()
  }

  return strategy as Strategy
}

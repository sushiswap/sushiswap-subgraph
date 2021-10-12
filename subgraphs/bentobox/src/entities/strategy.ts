import { Strategy } from '../../generated/schema'
import { BIG_INT_ZERO } from 'const'
import { Address, ethereum } from '@graphprotocol/graph-ts'

export function getOrCreateStrategy(_strategy: Address, token: Address, block: ethereum.Block): Strategy {
  let strategy = Strategy.load(_strategy.toHex())

  if (strategy === null) {
    strategy = new Strategy(_strategy.toHex())
    strategy.token = token.toHex()
    strategy.balance = BIG_INT_ZERO
    strategy.totalProfit = BIG_INT_ZERO
  }

  strategy.timestamp = block.timestamp
  strategy.block = block.number
  strategy.save()

  return strategy as Strategy
}

import { Server } from '../../generated/schema'
import { Address, ethereum } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO } from 'const'
import { getMaker } from './maker'

export function getServer(address: Address, block: ethereum.Block): Server {
  const maker = getMaker(block)

  let server = Server.load(address.toHex())

  if (server === null) {
    server = new Server(address.toHex())
    server.maker = maker.id
    server.sushiServed = BIG_INT_ZERO
    server.totalServings = BIG_DECIMAL_ZERO
  }

  server.timestamp = block.timestamp
  server.block = block.number
  server.save()

  return server as Server
}

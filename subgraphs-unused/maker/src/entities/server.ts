import { Address } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, SUSHI_MAKER_ADDRESS } from '../../../../packages/constants'
import { Server } from '../generated/schema'

export function getServer(address: Address): Server {
  const id = address.toHex()
  let server = Server.load(id)

  if (server === null) {
    server = new Server(id)
    server.maker = SUSHI_MAKER_ADDRESS.toHex()
    server.sushiServed = BIG_DECIMAL_ZERO
    server.save()
  }

  return server as Server
}
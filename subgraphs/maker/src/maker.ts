import { Address, ByteArray, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_1E18, BIG_DECIMAL_ZERO, FACTORY_ADDRESS, SUSHI_BAR_ADDRESS, SUSHI_MAKER_ADDRESS } from 'const'
import { Maker, Server, Serving } from '../generated/schema'

import { ERC20 as ERC20Contract } from '../generated/Maker/ERC20'
import { Factory as FactoryContract } from '../generated/Maker/Factory'
import { Swap as SwapEvent } from '../generated/Maker/Pair'

function getMaker(): Maker {
  const id = SUSHI_MAKER_ADDRESS.toHex()
  let maker = Maker.load(id)

  if (maker === null) {
    maker = new Maker(id)
    maker.sushiServed = BIG_DECIMAL_ZERO
    maker.save()
  }

  return maker as Maker
}

function getServer(address: Address): Server {
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

export function served(event: SwapEvent): void {
  // check if it's a swap from SushiMaker to SushiBar
  if (event.params.sender != SUSHI_MAKER_ADDRESS && event.params.to != SUSHI_BAR_ADDRESS) {
    return
  }

  const maker = getMaker()

  const server = getServer(event.transaction.from)

  const transaction = event.transaction

  const input = transaction.input.toHexString()

  const token0 = Address.fromString(ByteArray.fromHexString(input.substring(34, 74)).toHexString())
  const token1 = Address.fromString(ByteArray.fromHexString(input.substring(98, 138)).toHexString())

  const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)
  const token0Contract = ERC20Contract.bind(token0)
  const token1Contract = ERC20Contract.bind(token1)

  const pair = factoryContract.getPair(token0, token1)

  const sushiServed = event.params.amount0Out.divDecimal(BIG_DECIMAL_1E18)

  const id = pair.toHex().concat('-').concat(event.block.number.toString())
  const serving = new Serving(id)
  serving.maker = maker.id
  serving.server = server.id
  serving.tx = transaction.hash
  serving.pair = pair
  serving.token0 = token0
  serving.token1 = token1
  serving.block = event.block.number
  serving.timestamp = event.block.timestamp
  serving.sushiServed = sushiServed
  serving.save()

  server.sushiServed = server.sushiServed.plus(sushiServed)
  server.save()

  maker.sushiServed = maker.sushiServed.plus(sushiServed)
  maker.save()
}

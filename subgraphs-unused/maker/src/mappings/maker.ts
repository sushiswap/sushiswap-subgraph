import { Address, log } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS } from '../../../../packages/constants'
import { getMaker } from '../entities/maker'
import { getServer } from '../entities/server'
import { Serving } from '../generated/schema'
import { Factory as FactoryContract } from '../generated/Maker/Factory'
import { LogConvert as LogConvertEvent } from '../generated/Maker/Maker'


export function handleLogConvert(event: LogConvertEvent): void {

  const maker = getMaker()
  const server = getServer(event.params.server)

  const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)

  const pair = factoryContract.getPair(event.params.token0, event.params.token1)

  const amountSUSHI = event.params.amountSUSHI.toBigDecimal()

  // log.debug('server amount0 amount1 token0 token1 ; {} {} {} {} {}', [event.params.server.toHex(), event.params.amount0.toString(), event.params.amount1.toString(), event.params.token0.toHex(), event.params.token1.toHex()])

  const id = pair.toHex().concat('-').concat(event.block.number.toString())
  const serving = new Serving(id)
  serving.maker = maker.id
  serving.server = server.id
  serving.tx = event.transaction.hash
  serving.token0 = event.params.token0
  serving.token1 = event.params.token1
  serving.amount0 = event.params.amount0
  serving.amount1 = event.params.amount1
  serving.block = event.block.number
  serving.timestamp = event.block.timestamp
  serving.amountSUSHI = event.params.amountSUSHI
  serving.save()

  // log.debug('sushiServed amount0 tx  ; {} {} {}', [serving.amountSUSHI.toString(), event.params.amount0.toString(), serving.tx.toHexString()])

  server.sushiServed = server.sushiServed.plus(amountSUSHI)
  server.save()

  maker.sushiServed = maker.sushiServed.plus(amountSUSHI)
  maker.save()

}
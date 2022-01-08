import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ZERO,
  SUSHI_BAR_ADDRESS,
  SUSHI_TOKEN_ADDRESS,
  SUSHI_USDT_PAIR_ADDRESS,
} from 'const'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { AuctionTemplateAdded, AuctionTemplateRemoved, MarketCreated } from '../generated/MISOMarket/MISOMarket'
import { AddedCommitment, AuctionCancelled, AuctionFinalized } from '../generated/templates/MisoAuction/MisoAuction'
import { MisoAuction } from '../generated//templates'
import { getOrCreateFactory } from './entities/Factory'
import { createTemplate, getTemplate } from './entities/Template'
import { createAuction, getAuction } from './entities/Auction'
import { createCommitment } from './entities/Commitment'

export function handleAuctionTemplateAdded(event: AuctionTemplateAdded): void {
  getOrCreateFactory(event.address.toHex())
  createTemplate(event)
}

export function handleAuctionTemplateRemoved(event: AuctionTemplateRemoved): void {
  const template = getTemplate(event.params.auction.toHex())
  template.removed = true
  template.save()
}

export function handleMarketCreated(event: MarketCreated): void {
  createAuction(event)
  MisoAuction.create(event.params.addr)
}

export function handleAddedCommitment(event: AddedCommitment): void {
  createCommitment(event)
}

export function handleAuctionFinalized(event: AuctionFinalized): void {
  const auction = getAuction(event.address.toHex())
  auction.finalized = true
  auction.finalizedTimestamp = event.block.timestamp
  auction.save()
}

export function handleAuctionCancelled(event: AuctionCancelled): void {
  const auction = getAuction(event.address.toHex())
  auction.cancelled = true
  auction.cancelledTimestamp = event.block.timestamp
  auction.save()
}
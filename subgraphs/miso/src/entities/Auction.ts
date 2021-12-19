import { BIG_INT_ZERO } from 'const'
import { MarketCreated } from '../../generated/MISOMarket/MISOMarket'
import { Auction } from '../../generated/schema'

export function createAuction(event: MarketCreated): Auction {
  const auction = new Auction(event.params.addr.toHex())

  auction.factory = event.address.toHex()
  auction.template = event.params.marketTemplate.toHex()
  auction.auctionUserLength = BIG_INT_ZERO
  auction.commitmentsLength = BIG_INT_ZERO
  auction.totalCommited = BIG_INT_ZERO

  auction.deploymentTimestamp = event.block.timestamp
  auction.finalized = false
  auction.cancelled = false

  auction.save()

  return auction as Auction
}

export function getAuction(id: string): Auction {
  const auction = Auction.load(id)
  return auction as Auction
}
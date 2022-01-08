import { BIG_INT_ONE } from "const";
import { Commitment } from "../../generated/schema";
import { AddedCommitment } from "../../generated/templates/MisoAuction/MisoAuction";
import { getAuction } from "./Auction";
import { getOrCreateAuctionUser } from "./AuctionUser";

export function createCommitment(event: AddedCommitment): Commitment {
  const commitment = new Commitment(event.address.toHex() + event.params.addr.toHex() + event.block.number.toString() + event.transactionLogIndex.toString())

  getOrCreateAuctionUser(event.params.addr.toHex(), event.address.toHex())

  commitment.auction = event.address.toHex()
  commitment.auctionUser = event.address.toHex() + "-" + event.params.addr.toHex()
  commitment.user = event.params.addr.toHex()
  commitment.amount = event.params.commitment
  commitment.block = event.block.number
  commitment.timestamp = event.block.timestamp

  commitment.save()

  const auction = getAuction(event.address.toHex())
  auction.commitmentsLength = auction.commitmentsLength.plus(BIG_INT_ONE)
  auction.totalCommited = auction.totalCommited.plus(event.params.commitment)
  auction.save()

  return commitment as Commitment
}
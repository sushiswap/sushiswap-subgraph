import { BIG_INT_ONE } from "const";
import { Auction, AuctionUser } from "../../generated/schema";
import { getOrCreateUser } from "./User";

export function getOrCreateAuctionUser(user: string, _auction: string): AuctionUser {
  let auctionUser = AuctionUser.load(user + "-" + _auction)

  getOrCreateUser(user)

  if(auctionUser === null) {
    auctionUser = new AuctionUser(user + "-" + _auction)

    auctionUser.auction = _auction
    auctionUser.user = user
    
    auctionUser.save()

    const auction = Auction.load(_auction)
    auction.auctionUserLength = auction.auctionUserLength.plus(BIG_INT_ONE)
    auction.save()
  }

  return auctionUser as AuctionUser
}
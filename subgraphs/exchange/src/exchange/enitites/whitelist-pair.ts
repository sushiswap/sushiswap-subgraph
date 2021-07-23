import { log } from '@graphprotocol/graph-ts'
import { WhitelistPair } from '../../../generated/schema'

export function createOrLoadWhitelistPair(whiteListAddress: string, tokenId: string): WhitelistPair {
  const whiteListPairId = whiteListAddress.concat('-').concat(tokenId)

  let whiteListPair = WhitelistPair.load(whiteListPairId)

  if (whiteListPair === null) {
    whiteListPair = new WhitelistPair(whiteListPairId)
    whiteListPair.save()
  }

  return whiteListPair as WhitelistPair
}

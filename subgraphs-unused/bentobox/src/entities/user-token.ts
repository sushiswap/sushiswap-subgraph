import { ethereum } from '@graphprotocol/graph-ts'
import { Token, User, UserToken } from '../../generated/schema'
import { BIG_INT_ZERO } from 'const'

export function getUserToken(user: User, token: Token, block: ethereum.Block): UserToken {
  const id = user.id.concat('-').concat(token.id)

  let userToken = UserToken.load(id)

  if (userToken === null) {
    userToken = new UserToken(id)
    userToken.user = user.id
    userToken.token = token.id
    userToken.share = BIG_INT_ZERO
  }

  userToken.block = block.number
  userToken.timestamp = block.timestamp
  userToken.save()

  return userToken as UserToken
}

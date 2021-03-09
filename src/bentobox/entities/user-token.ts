import { Token, User, UserToken } from '../../../generated/schema'

import { BIG_INT_ZERO } from '../constants'

export function getUserToken(user: User, token: Token): UserToken {
  const id = user.id.concat('-').concat(token.id)

  let userToken = UserToken.load(id)

  if (userToken === null) {
    userToken = new UserToken(id)
    userToken.user = user.id
    userToken.token = token.id
    userToken.amount = BIG_INT_ZERO
    userToken.share = BIG_INT_ZERO
    userToken.save()
  }

  return userToken as UserToken
}

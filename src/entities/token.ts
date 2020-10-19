import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { NULL_CALL_RESULT_VALUE, ZERO_BIG_DECIMAL, ZERO_BIG_INT } from '../constants'
import {
  getTokenDecimals,
  getTokenName,
  getTokenSymbol,
} from '../token-list'

import { ERC20 } from '../../generated/Factory/ERC20'
import { ERC20NameBytes } from '../../generated/Factory/ERC20NameBytes'
import { ERC20SymbolBytes } from '../../generated/Factory/ERC20SymbolBytes'
import { Token } from '../../generated/schema'
import { getFactory } from '.'

export function getToken(address: Address): Token | null {
  let token = Token.load(address.toHex())

  if (token === null) {
    const factory = getFactory()
    factory.tokenCount = factory.tokenCount.plus(BigInt.fromI32(1))
    factory.save()

    token = new Token(address.toHex())
    token.factory = factory.id
    token.symbol = getSymbol(address)
    token.name = getName(address)
    token.totalSupply = getTotalSupply(address)
    const decimals = getDecimals(address)

    // TODO: Does this ever happen?
    if (decimals === null) {
      log.debug('Demicals for token {} was null, bail', [address.toHex()])
      return null
    }

    token.decimals = decimals
    token.derivedETH = ZERO_BIG_DECIMAL
    token.volume = ZERO_BIG_DECIMAL
    token.volumeUSD = ZERO_BIG_DECIMAL
    token.untrackedVolumeUSD = ZERO_BIG_DECIMAL
    token.liquidity = ZERO_BIG_DECIMAL
    token.txCount = ZERO_BIG_INT
    token.save()
  }

  return token as Token
}

export function getSymbol(address: Address): string {
  // hard coded override
  if (address.toHex() == '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
    return 'DGD'
  }
  if (address.toHex() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
    return 'AAVE'
  }

  const contract = ERC20.bind(address)
  const contractSymbolBytes = ERC20SymbolBytes.bind(address)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  const symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    const symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (symbolResultBytes.value.toHex() != NULL_CALL_RESULT_VALUE) {
        symbolValue = symbolResultBytes.value.toString()
      }
    } else {
      // Fallback to token list
      log.warning('Token symbol not defined in ERC20 Contract: {}', [address.toHexString()])
      symbolValue = getTokenSymbol(address)
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function getName(address: Address): string {
  // hard coded override
  // if (address.toHex() == '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
  //   return 'DGD'
  // }
  // if (address.toHex() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
  //   return 'Aave Token'
  // }

  const contract = ERC20.bind(address)
  const contractNameBytes = ERC20NameBytes.bind(address)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  const nameResult = contract.try_name()
  if (nameResult.reverted) {
    const nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (nameResultBytes.value.toHex() != NULL_CALL_RESULT_VALUE) {
        nameValue = nameResultBytes.value.toString()
      }
    } else {
      // Fallback to token list
      log.warning('Token name not defined in ERC20 Contract: {}',  [address.toHexString()])
      nameValue = getTokenName(address)
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function getTotalSupply(address: Address): BigInt {
  const contract = ERC20.bind(address)
  let totalSupplyValue = null
  const totalSupplyResult = contract.try_totalSupply()
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult as i32
  }
  return BigInt.fromI32(totalSupplyValue as i32)
}

export function getDecimals(address: Address): BigInt {
  // hardcode overrides
  if (address.toHex() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
    return BigInt.fromI32(18)
  }

  const contract = ERC20.bind(address)
  // try types uint8 for decimals
  let decimalValue = null
  const decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  } else {
    log.warning('Token decimals not defined in ERC20 Contract: {}', [address.toHexString()])
    return getTokenDecimals(address)
  }

  return BigInt.fromI32(decimalValue as i32)
}

import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO, BIG_INT_ONE, NULL_CALL_RESULT_VALUE, BENTOBOX_ADDRESS } from 'const'

import { ERC20 } from '../../generated/BentoBox/ERC20'
import { ERC20NameBytes } from '../../generated/BentoBox/ERC20NameBytes'
import { ERC20SymbolBytes } from '../../generated/BentoBox/ERC20SymbolBytes'
import { Token } from '../../generated/schema'
import { getBentoBox } from './bentobox'

export function createToken(address: Address, block: ethereum.Block): Token {
  const bentoBox = getBentoBox(block)

  const token = new Token(address.toHex())

  token.symbol = getSymbol(address)
  token.bentoBox = bentoBox.id
  token.name = getName(address)
  token.decimals = getDecimals(address)
  token.totalSupplyBase = BIG_INT_ZERO
  token.totalSupplyElastic = BIG_INT_ZERO
  token.block = block.number
  token.timestamp = block.timestamp

  token.save()

  bentoBox.totalTokens = bentoBox.totalTokens.plus(BIG_INT_ONE)
  bentoBox.save()

  return token as Token
}

export function getToken(address: Address, block: ethereum.Block): Token {
  let token = Token.load(address.toHex())

  if (token === null) {
    token = createToken(address, block)
  }

  token.block = block.number
  token.timestamp = block.timestamp
  token.save()

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
  if (address.toHexString() == '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c') {
    return 'yUSD'
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
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function getName(address: Address): string {
  if (address.toHex() == '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
    return 'DGD'
  }
  if (address.toHex() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
    return 'Aave Token'
  }
  if (address.toHexString() == '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c') {
    return 'yUSD'
  }

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
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
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
  }

  return BigInt.fromI32(decimalValue as i32)
}

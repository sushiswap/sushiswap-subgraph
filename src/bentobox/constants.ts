import { Address, BigInt } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BENTOBOX_ADDRESS = Address.fromString('0xb5891167796722331b7ea7824f036b3bdcb4531c')

export const BIG_INT_MINUS_ONE = BigInt.fromI32(-1)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100)

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const BENTOBOX_DEPOSIT = 'deposit'

export const BENTOBOX_TRANSFER = 'transfer'

export const BENTOBOX_WITHDRAW = 'withdraw'

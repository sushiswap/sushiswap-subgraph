import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const ZERO_BIG_DECIMAL = BigDecimal.fromString('0')

export const ONE_BIG_DECIMAL = BigDecimal.fromString('1')

export const ZERO_BIG_INT = BigInt.fromI32(0)

export const ONE_BIG_INT = BigInt.fromI32(1)

export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const SUSHI_MAKER_ADDRESS = Address.fromString('0x6684977bbed67e101bb80fc07fccfba655c0a64f')

export const BIG_DECIMAL_1E12 = BigDecimal.fromString('1e12')

export const MASTER_CHEF_ADDRESS = Address.fromString('0xc2edad668740f1aa35e4d8f227fb8e17dca888cd')

export const SUSHI_BAR_ADDRESS = Address.fromString('0x8798249c2e607446efb7ad49ec89dd1865ff4272')

export const SUSHI_TOKEN_ADDRESS = Address.fromString('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x680a025da7b1be2c204d7745e809919bce074026')

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

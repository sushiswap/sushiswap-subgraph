import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')

export const BIG_DECIMAL_1E12 = BigDecimal.fromString('1e12')

export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const BIG_DECIMAL_ZERO = BigDecimal.fromString('0')

export const BIG_DECIMAL_ONE = BigDecimal.fromString('1')

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_TWO = BigInt.fromI32(2)

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100)

export const BIG_INT_ONE_DAY_SECONDS = BigInt.fromI32(86400)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const LOCKUP_POOL_NUMBER = BigInt.fromI32(29)

export const FACTORY_ADDRESS = Address.fromString('0xc35dadb65012ec5796536bd9864ed8773abc74c4')

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

export const MASTER_CHEF_ADDRESS = Address.fromString('0x80c7dd17b01855a6d2347444a0fcc36136a314de')

export const SUSHI_BAR_ADDRESS = Address.fromString('0x1be211d8da40bc0ae8719c6663307bfc987b1d6c')

export const SUSHI_MAKER_ADDRESS = Address.fromString('0x1b9d177ccdea3c79b6c8f40761fc8dc9d0500eaa')

export const SUSHI_TOKEN_ADDRESS = Address.fromString('0x0769fd68dfb93167989c6f7254cd0d766fb2841f')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = ''

export const DAI_WETH_PAIR = ''

export const USDT_WETH_PAIR = ''

export const SUSHI_USDT_PAIR = ''

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('5')

export const WETH_ADDRESS = Address.fromString('0xc778417e063141139fce010982780140aa0cd5ab')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('')

export const USDT_ADDRESS = Address.fromString('')

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f')

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('')

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString('')

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString('')

export const SHIBASWAP_TOPDOG_ADDRESS = Address.fromString("0x3107713B76193C2648ddf20E3206f753b66e3553")
export const SHIBASWAP_TOPDOG_START_BLOCK = BigInt.fromI32(24302209)


// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString('')

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString('')

export const BENTOBOX_DEPOSIT = 'deposit'

export const BENTOBOX_TRANSFER = 'transfer'

export const BENTOBOX_WITHDRAW = 'withdraw'

export const KASHI_PAIR_MEDIUM_RISK_TYPE = 'medium'

export const PAIR_ADD_COLLATERAL = 'addCollateral'

export const PAIR_REMOVE_COLLATERAL = 'removeCollateral'

export const PAIR_ADD_ASSET = 'addAsset'

export const PAIR_REMOVE_ASSET = 'removeAsset'

export const PAIR_BORROW = 'borrow'

export const PAIR_REPAY = 'repay'

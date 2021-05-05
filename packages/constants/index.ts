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

export const MASTER_CHEF_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_BAR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_MAKER_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_TOKEN_ADDRESS = Address.fromString('0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '0x853ee4b2a13f8a742d64c8f088be7ba2131f670d'

export const DAI_WETH_PAIR = '0x4a35582a710e1f4b2030a3f826da20bfb6703c09'

export const USDT_WETH_PAIR = '0xf6422b997c7f54d1c6a6e103bcb1499eea0a7046'

export const SUSHI_USDT_PAIR = '0x0000000000000000000000000000000000000000'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('5')

export const WETH_ADDRESS = Address.fromString('0x7ceb23fd6bc0add59e62ac25578270cff1b9f619')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const USDT_ADDRESS = Address.fromString('0xc2132d05d31c914a87c6611c10748aeb04b58e8f')

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')


// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString('0xf5bce5077908a1b7370b9ae04adc565ebd643966')

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString('0x2cba6ab6574646badc84f0544d05059e57a5dc42')

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


// MiniChef
export const MINI_CHEF_ADDRESS = Address.fromString('0x0769fd68dfb93167989c6f7254cd0d766fb2841f')

export const ACC_SUSHI_PRECISION = BigInt.fromString('1000000000000')

// Matic Complex Rewarder (note: putting here for now since we don't need to fill in every config file with this address)
export const MATIC_COMPLEX_REWARDER = Address.fromString('0xa3378ca78633b3b9b2255eaa26748770211163ae')

export const WMATIC_ADDRESS = Address.fromString('0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270')

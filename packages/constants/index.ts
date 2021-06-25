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

export const MASTER_CHEF_V2_ADDRESS = Address.fromString('0xef0881ec094552b2e128cf945ef17a6752b4ec5d')

export const SUSHI_BAR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_MAKER_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_TOKEN_ADDRESS = Address.fromString('0x2218e0d5e0173769f5b4939a3ae423f7e5e4eab7')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '0x0000000000000000000000000000000000000000'

export const DAI_WETH_PAIR = '0x0000000000000000000000000000000000000000'

export const USDT_WETH_PAIR = '0x0000000000000000000000000000000000000000'

export const SUSHI_USDT_PAIR = '0x0000000000000000000000000000000000000000'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('5')

export const WETH_ADDRESS = Address.fromString('0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const USDT_ADDRESS = Address.fromString('0x382bb369d343125bfb2117af9c149795c6c65c50')

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')


// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

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
export const MINI_CHEF_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const ACC_SUSHI_PRECISION = BigInt.fromString('1000000000000')

// Matic Complex Rewarder (note: putting here for now since we don't need to fill in every config file with this address)
export const MATIC_COMPLEX_REWARDER = Address.fromString('')

export const WMATIC_ADDRESS = Address.fromString('0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270')

export const WNATIVE_ADDRESS = Address.fromString('0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15')

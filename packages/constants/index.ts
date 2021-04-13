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

export const SUSHI_TOKEN_ADDRESS = Address.fromString('0x2995d1317dcd4f0ab89f4ae60f3f020a4f17c7ce')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '0xa227c72a4055a9dc949cae24f54535fe890d3663'

export const DAI_WETH_PAIR = '0x7661feeea97179244b8343e0db044f9f1765e4d2'

export const USDT_WETH_PAIR = '0x6685c047eab042297e659bfaa7423e94b4a14b9e'

export const SUSHI_USDT_PAIR = '0x0000000000000000000000000000000000000000'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('0')

export const WETH_ADDRESS = Address.fromString('0xe91d153e0b41518a2ce8dd3d7944fa863463a97d')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x6685c047eab042297e659bfaa7423e94b4a14b9e')

export const USDT_ADDRESS = Address.fromString('0x4ecaba5870353805a9f068101a40e0f32ed605c6')

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

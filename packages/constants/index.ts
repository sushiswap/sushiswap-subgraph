import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

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

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const ACC_SUSHI_PRECISION = BigInt.fromString('1000000000000')

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

export const FACTORY_ADDRESS = Address.fromString(
  '0x43ea90e2b786728520e4f930d2a71a477bf2737c'
)

export const MASTER_CHEF_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const MASTER_CHEF_V2_ADDRESS = Address.fromString('0xef0881ec094552b2e128cf945ef17a6752b4ec5d')

export const SUSHI_BAR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const SUSHI_MAKER_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const SUSHI_TOKEN_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const USDC_WETH_PAIR =
  '0xba9ca720e314f42e17e80991c1d0affe47387108'

export const DAI_WETH_PAIR =
  '0x44f5b873d6b2a2ee8309927e22f3359c7f23d428'

export const USDT_WETH_PAIR =
  '0xadf3924f44d0ae0242333cde32d75309b30a0fcc'

export const SUSHI_USDT_PAIR =
  '0x0000000000000000000000000000000000000000'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('15000')

export const WETH_ADDRESS = Address.fromString(
  '0xa722c13135930332eb3d749b2f0906559d2c5b99'
)

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const USDT_ADDRESS = Address.fromString(
  '0xfadbbf8ce7d5b7041be672561bba99f79c532e10'
)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// MiniChef
export const MINI_CHEF_ADDRESS = Address.fromString(
  '0x182cd0c6f1faec0aed2ea83cd0e160c8bd4cb063'
)

export const COMPLEX_REWARDER = Address.fromString(
  '0xef502259dd5d497d082498912031e027c4515563'
)

export const CONVEX_REWARDERS: Array<Address> = [
  Address.fromString('0x9e01aac4b3e8781a85b21d9d9f848e72af77b362'),
  Address.fromString('0x1fd97b5e5a257b0b9b9a42a96bb8870cbdd1eb79'),
]

export const ALCX_REWARDER = Address.fromString('0x7519c93fc5073e15d89131fd38118d73a72370f8')

export const LIDO_REWARDER = Address.fromString('0x75ff3dd673ef9fc459a52e1054db5df2a1101212')

export const NATIVE = Address.fromString(
  '0x0be9e53fd7edac9f859882afdda116645287c629'
)

export const USDC = '0x620fd5fa44be6af63715ef4e65ddfa0387ad13f5'

export const USDT = '0xfadbbf8ce7d5b7041be672561bba99f79c532e10'

export const DAI = '0x94ba7a27c7a95863d1bdc7645ac2951e0cca06ba'

export const WHITELIST: string[] = '0x0be9e53fd7edac9f859882afdda116645287c629,0xa722c13135930332eb3d749b2f0906559d2c5b99,0x94ba7a27c7a95863d1bdc7645ac2951e0cca06ba,0xfadbbf8ce7d5b7041be672561bba99f79c532e10,0x33284f95ccb7b948d9d352e1439561cf83d8d00d,0x249be57637d8b013ad64785404b24aebae9b098b'.split(',')

// export const WHITELIST: string[] = [
//   "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
//   "0x6983d1e6def3690c4d616b13597a09e6193ea013",
//   "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
//   "0x985458e523db3d53125813ed68c274899e9dfab4",
//   "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f",
//   "0xe176ebe47d621b984a73036b9da5d834411ef734",
// ]

// export const WHITELIST: string[] = [
//   "0x471ece3750da237f93b8e339c536989b8978a438",
//   "0xd629eb00deced2a080b7ec630ef6ac117e614f1b",
//   "0x765de816845861e75a25fca122bb6898b8b1282a",
//   "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73"
// ];

const CUSTOM_BASES = new Map<string, string>()

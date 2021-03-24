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

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '0x0000000000000000000000000000000000000000'

export const DAI_WETH_PAIR = '0x0000000000000000000000000000000000000000'

export const USDT_WETH_PAIR = '0x0000000000000000000000000000000000000000'

export const SUSHI_USDT_PAIR = '0x0000000000000000000000000000000000000000'

export const WHITELIST: string[] = [
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  '0x0000000000085d4780b73119b644ae5ecd22b376', // TUSD
  '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
  '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
  '0x86fadb80d8d2cff3c3680819e4da99c10232ba0f', // EBASE
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
  '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
  '0x514910771af9ca656af840dff83e8264ecf986ca', //LINK
  '0x960b236a07cf122663c4303350609a66a7b288c0', //ANT
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', //SNX
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', //YFI
  '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', // yCurv
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('0')

export const WETH_ADDRESS = Address.fromString('0xc778417e063141139fce010982780140aa0cd5ab')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const USDT_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f')

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')


// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString('0xccb146728f6D94Fe22D1030E7FA369bd33916824')

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString('0xd57469335e06ed52b57278a0ff4ecb62bad05e99')

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

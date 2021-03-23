import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')

export const BIG_DECIMAL_1E12 = BigDecimal.fromString('1e12')

export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const BIG_DECIMAL_ZERO = BigDecimal.fromString('0')

export const BIG_DECIMAL_ONE = BigDecimal.fromString('1')

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_ONE_DAY_SECONDS = BigInt.fromI32(86400)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const LOCKUP_POOL_NUMBER = BigInt.fromI32(29)

export const FACTORY_ADDRESS = Address.fromString('{{ factory_address }}')

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

export const MASTER_CHEF_ADDRESS = Address.fromString('{{ masterchef_address }}')

export const SUSHI_BAR_ADDRESS = Address.fromString('{{ sushi_bar_address }}')

export const SUSHI_MAKER_ADDRESS = Address.fromString('{{ sushi_maker_address }}')

export const SUSHI_TOKEN_ADDRESS = Address.fromString('{{ sushi_token_address }}')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('{{ sushi_usdt_pair_address }}')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('{{ xsushi_usdc_pair_address }}')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('{{ xsushi_weth_pair_address }}')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('{{ sushi_distributor_address }}')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '{{ usdc_weth_pair }}'

export const DAI_WETH_PAIR = '{{ dai_weth_pair }}'

export const USDT_WETH_PAIR = '{{ usdt_weth_pair }}'

export const SUSHI_USDT_PAIR = '{{ sushi_usdt_pair }}'

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

export const WETH_ADDRESS = Address.fromString('{{ weth_address }}')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('{{ sushiswap_weth_usdt_pair_address }}')

export const USDT_ADDRESS = Address.fromString('{{ usdt_address }}')

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('{{ uniswap_factory_address }}')

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('{{ uniswap_weth_usdt_pair_address }}')

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString('{{ uniswap_sushi_eth_pair_address }}')

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString('{{ uniswap_sushi_usdt_pair_address }}')

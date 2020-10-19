import { Address, BigDecimal, BigInt, TypedMap } from '@graphprotocol/graph-ts'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const USDC_WETH_PAIR = '0x397ff1542f962076d0bfe58ea045ffa2d347aca0'
export const DAI_WETH_PAIR = '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f'
export const USDT_WETH_PAIR = '0x06da0fd433c1a5d7a4faa01111c044910a184553'

export const SUSHI_USDT_PAIR = '0x680a025da7b1be2c204d7745e809919bce074026'

export const FACTORY_ADDRESS = '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac'

export const MASTER_CHEF_ADDRESS = Address.fromString('0xc2edad668740f1aa35e4d8f227fb8e17dca888cd')

export const SUSHIBAR_ADDRESS = Address.fromString('0x8798249c2e607446efb7ad49ec89dd1865ff4272')

export const SUSHITOKEN_ADDRESS =  Address.fromString('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')

// token where amounts should contribute to tracked volume and liquidity
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

export const ZERO_BIG_DECIMAL = BigDecimal.fromString('0')

export const ONE_BIG_DECIMAL = BigDecimal.fromString('1')

export const ZERO_BIG_INT = BigInt.fromI32(0)

export const ONE_BIG_INT = BigInt.fromI32(1)

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

// export const MIGRATION_MAP = {
//   17: "0x58Dc5a51fE44589BEb22E8CE67720B5BC5378009",
// }


export const MIGRATIONS = new TypedMap<Address, Address>()

// 17 - WETH-CRV
MIGRATIONS.set(Address.fromString("0x3da1313ae46132a397d90d95b1424a9a7e3e0fce"), Address.fromString("0x58dc5a51fe44589beb22e8ce67720b5bc5378009"))

// 16 - YAMv2-WETH
MIGRATIONS.set(Address.fromString("0x177b8b46a898d4c68a238054fe6049c90066776c"), Address.fromString("0x95b54c8da12bb23f7a5f6e26c38d04acc6f81820"))

// 13 - REN-WETH
MIGRATIONS.set(Address.fromString("0x8bd1661da98ebdd3bd080f0be4e6d9be8ce9858c"), Address.fromString("0x611cde65dea90918c0078ac0400a72b0d25b9bb1"))

// 15 - SRM-WETH - block_number: 10829235
MIGRATIONS.set(Address.fromString("0xcc3d1ecef1f9fd25599dbea2755019dc09db3c54"), Address.fromString("0x117d4288b3635021a3d612fe05a3cbf5c717fef2"))

// 7 - UMA-WETH - block_number: 10829243
MIGRATIONS.set(Address.fromString("0x88d97d199b9ed37c29d846d00d443de980832a22"), Address.fromString("0x001b6450083e531a5a7bf310bd2c1af4247e23d4"))

// 4 - COMP-WETH - block_number: 10829250
MIGRATIONS.set(Address.fromString("0xcffdded873554f362ac02f8fb1f02e5ada10516f"), Address.fromString("0x31503dcb60119a812fee820bb7042752019f2355"))

// 9 - BAND-WETH - block_number: 10829262
MIGRATIONS.set(Address.fromString("0xf421c3f2e695c2d4c0765379ccace8ade4a480d9"), Address.fromString("0xa75f7c2f025f470355515482bde9efa8153536a8"))

// 6 - SNX-WETH - block_number: 10829272
MIGRATIONS.set(Address.fromString("0x43ae24960e5534731fc831386c07755a2dc33d47"), Address.fromString("0xa1d7b2d891e3a1f9ef4bbc5be20630c2feb1c470"))

// 5 - LEND-WETH - block_number: 10829280
MIGRATIONS.set(Address.fromString("0xab3f9bf1d81ddb224a2014e98b238638824bcf20"), Address.fromString("0x5e63360e891bd60c69445970256c260b0a6a54c6"))

// 3 - sUSD-WETH - block_number: 10829294
MIGRATIONS.set(Address.fromString("0xf80758ab42c3b07da84053fd88804bcb6baa4b5c"), Address.fromString("0xf1f85b2c54a2bd284b1cf4141d64fd171bd85539"))

// 10 - WETH-AMPL - block_number: 10829302
MIGRATIONS.set(Address.fromString("0xc5be99a02c6857f9eac67bbce58df5572498f40c"), Address.fromString("0xcb2286d9471cc185281c4f763d34a962ed212962"))

// 8 - LINK-WETH - block_number: 10829307
MIGRATIONS.set(Address.fromString("0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974"), Address.fromString("0xc40d16476380e4037e6b1a2594caf6a6cc8da967"))

// 11 - YFI-WETH - block_number: 10829310
MIGRATIONS.set(Address.fromString("0x2fdbadf3c4d5a8666bc06645b8358ab803996e28"), Address.fromString("0x088ee5007c98a9677165d78dd2109ae4a3d04d0c"))

// 2 - DAI-WETH - block_number: 10829331
MIGRATIONS.set(Address.fromString("0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"), Address.fromString("0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f"))

// 1 - USDC-WETH - block_number: 10829331
MIGRATIONS.set(Address.fromString("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"), Address.fromString("0x397ff1542f962076d0bfe58ea045ffa2d347aca0"))

// 12 - SUSHI-WETH - block_number: 10829340
MIGRATIONS.set(Address.fromString("0xce84867c3c02b05dc570d0135103d3fb9cc19433"), Address.fromString("0x795065dcc9f64b5614c407a6efdc400da6221fb0"))

// 0 - WETH-USDT - block_number: 10829344
MIGRATIONS.set(Address.fromString("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"), Address.fromString("0x06da0fd433c1a5d7a4faa01111c044910a184553"))

// 30... What is this pool?

export const NUMBER_LITERAL_1E18 = BigDecimal.fromString("1e18")


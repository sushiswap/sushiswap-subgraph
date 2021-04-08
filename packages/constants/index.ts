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

export const SUSHI_TOKEN_ADDRESS = Address.fromString('0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '0xa48869049e36f8bfe0cc5cf655632626988c0140'

export const DAI_WETH_PAIR = '0xd32f2eb49e91aa160946f3538564118388d6246a'

export const USDT_WETH_PAIR = '0x9555cbdfe51d1619fc199ba0b623516fbd02b0a3'

export const SUSHI_USDT_PAIR = '0x0000000000000000000000000000000000000000'

const mainnet = [
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  '0x6b175474e89094c44da98b954eedeac495271d0f'
]

const fantom = [
  '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  '0xad84341756bf337f5a0164515b1f6f993d194e1f'
]

export const WHITELIST = { mainnet, fantom }

export const BLACKLIST_EXCHANGE_VOLUME: string[] = [
  '0x9ea3b5b4ec044b70375236a281986106457b20ef' // DELTA
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('0')

export const WETH_ADDRESS = Address.fromString('0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x9555cbdfe51d1619fc199ba0b623516fbd02b0a3')

export const USDT_ADDRESS = Address.fromString('0x1b27a9de6a775f98aaa5b90b62a4e2a0b84dbdd9')

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

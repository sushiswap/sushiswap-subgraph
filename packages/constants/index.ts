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

export const FACTORY_ADDRESS = Address.fromString('0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac')

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

export const MASTER_CHEF_ADDRESS = Address.fromString('0xc2edad668740f1aa35e4d8f227fb8e17dca888cd')

export const SUSHI_BAR_ADDRESS = Address.fromString('0x8798249c2e607446efb7ad49ec89dd1865ff4272')

export const SUSHI_MAKER_ADDRESS = Address.fromString('0xE11fc0B43ab98Eb91e9836129d1ee7c3Bc95df50')

export const SUSHI_TOKEN_ADDRESS = Address.fromString('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0x680a025da7b1be2c204d7745e809919bce074026')

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString('0xd597924b16cc1904d808285bc9044fd51ceeead7')

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString('0x36e2fcccc59e5747ff63a03ea2e5c0c2c14911e7')

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString('0xcbe6b83e77cdc011cc18f6f0df8444e5783ed982')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '0x397ff1542f962076d0bfe58ea045ffa2d347aca0'

export const DAI_WETH_PAIR = '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f'

export const USDT_WETH_PAIR = '0x06da0fd433c1a5d7a4faa01111c044910a184553'

export const SUSHI_USDT_PAIR = '0x680a025da7b1be2c204d7745e809919bce074026'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('5')

export const WETH_ADDRESS = Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x06da0fd433c1a5d7a4faa01111c044910a184553')

export const USDT_ADDRESS = Address.fromString('0xdac17f958d2ee523a2206206994597c13d831ec7')

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f')

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852')

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString('0xce84867c3c02b05dc570d0135103d3fb9cc19433')

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString('0xe3ffab89e53422f468be955e7011932efe80aa26')


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

export enum ChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42,
    MATIC = 137,
    MATIC_TESTNET = 80001,
    FANTOM = 250,
    FANTOM_TESTNET = 4002,
    XDAI = 100,
    BSC = 56,
    BSC_TESTNET = 97,
    ARBITRUM = 79377087078960,
    MOONBASE = 1287,
    AVALANCHE = 43114,
    FUJI = 43113,
    HECO = 128,
    HECO_TESTNET = 256,
    HARMONY = 1666600000,
    HARMONY_TESTNET = 1666700000
}

export const SHIBASWAP_TOPDOG_START_BLOCK = BigInt.fromI32(10750000)
export const SHIBASWAP_TOPDOG_ADDRESS = Address.fromString('0x3107713B76193C2648ddf20E3206f753b66e3553');

// export const SHIBASWAP_BURY_BONE_ADDRESS: { [chainId in ChainId]: string } = {
//     [ChainId.MAINNET]: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
//     [ChainId.ROPSTEN]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.RINKEBY]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.GÖRLI]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.KOVAN]: '0xDcfc709dB81230bF75b7d2B419a9EbD234770541',
//     [ChainId.FANTOM]: '',
//     [ChainId.FANTOM_TESTNET]: '',
//     [ChainId.MATIC]: '',
//     [ChainId.MATIC_TESTNET]: '',
//     [ChainId.XDAI]: '',
//     [ChainId.BSC]: '',
//     [ChainId.BSC_TESTNET]: '',
//     [ChainId.ARBITRUM]: '',
//     [ChainId.MOONBASE]: '',
//     [ChainId.AVALANCHE]: '',
//     [ChainId.FUJI]: '',
//     [ChainId.HECO]: '',
//     [ChainId.HECO_TESTNET]: '',
//     [ChainId.HARMONY]: '',
//     [ChainId.HARMONY_TESTNET]: ''
// }
//
// export const SHIBASWAP_BURY_LEASH_ADDRESS: { [chainId in ChainId]: string } = {
//     [ChainId.MAINNET]: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
//     [ChainId.ROPSTEN]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.RINKEBY]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.GÖRLI]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.KOVAN]: '0x3956930a50aA6532D518f11EB2bb4c375aC2208A',
//     [ChainId.FANTOM]: '',
//     [ChainId.FANTOM_TESTNET]: '',
//     [ChainId.MATIC]: '',
//     [ChainId.MATIC_TESTNET]: '',
//     [ChainId.XDAI]: '',
//     [ChainId.BSC]: '',
//     [ChainId.BSC_TESTNET]: '',
//     [ChainId.ARBITRUM]: '',
//     [ChainId.MOONBASE]: '',
//     [ChainId.AVALANCHE]: '',
//     [ChainId.FUJI]: '',
//     [ChainId.HECO]: '',
//     [ChainId.HECO_TESTNET]: '',
//     [ChainId.HARMONY]: '',
//     [ChainId.HARMONY_TESTNET]: ''
// }
//
// export const SHIBASWAP_BURY_SHIB_ADDRESS: { [chainId in ChainId]: string } = {
//     [ChainId.MAINNET]: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
//     [ChainId.ROPSTEN]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.RINKEBY]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.GÖRLI]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.KOVAN]: '0x9f7DFDD8F11F46f2154e81e0A07147665eF56CA2',
//     [ChainId.FANTOM]: '',
//     [ChainId.FANTOM_TESTNET]: '',
//     [ChainId.MATIC]: '',
//     [ChainId.MATIC_TESTNET]: '',
//     [ChainId.XDAI]: '',
//     [ChainId.BSC]: '',
//     [ChainId.BSC_TESTNET]: '',
//     [ChainId.ARBITRUM]: '',
//     [ChainId.MOONBASE]: '',
//     [ChainId.AVALANCHE]: '',
//     [ChainId.FUJI]: '',
//     [ChainId.HECO]: '',
//     [ChainId.HECO_TESTNET]: '',
//     [ChainId.HARMONY]: '',
//     [ChainId.HARMONY_TESTNET]: ''
// }
//
// export const SHIBASWAP_BURY_TREAT_ADDRESS: { [chainId in ChainId]: string } = {
//     [ChainId.MAINNET]: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
//     [ChainId.ROPSTEN]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.RINKEBY]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.GÖRLI]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.KOVAN]: '0x06177a4f048c792644DA4c3B87aB1f5d4c1D3234',
//     [ChainId.FANTOM]: '',
//     [ChainId.FANTOM_TESTNET]: '',
//     [ChainId.MATIC]: '',
//     [ChainId.MATIC_TESTNET]: '',
//     [ChainId.XDAI]: '',
//     [ChainId.BSC]: '',
//     [ChainId.BSC_TESTNET]: '',
//     [ChainId.ARBITRUM]: '',
//     [ChainId.MOONBASE]: '',
//     [ChainId.AVALANCHE]: '',
//     [ChainId.FUJI]: '',
//     [ChainId.HECO]: '',
//     [ChainId.HECO_TESTNET]: '',
//     [ChainId.HARMONY]: '',
//     [ChainId.HARMONY_TESTNET]: ''
// }
//
// export const SHIBASWAP_UNI_FETCH_ADDRESS: { [chainId in ChainId]: string } = {
//     [ChainId.MAINNET]: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
//     [ChainId.ROPSTEN]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.RINKEBY]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.GÖRLI]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.KOVAN]: '0x7803a532dadE25d89116bfd995850dc0d3c59EC9',
//     [ChainId.FANTOM]: '',
//     [ChainId.FANTOM_TESTNET]: '',
//     [ChainId.MATIC]: '',
//     [ChainId.MATIC_TESTNET]: '',
//     [ChainId.XDAI]: '',
//     [ChainId.BSC]: '',
//     [ChainId.BSC_TESTNET]: '',
//     [ChainId.ARBITRUM]: '',
//     [ChainId.MOONBASE]: '',
//     [ChainId.AVALANCHE]: '',
//     [ChainId.FUJI]: '',
//     [ChainId.HECO]: '',
//     [ChainId.HECO_TESTNET]: '',
//     [ChainId.HARMONY]: '',
//     [ChainId.HARMONY_TESTNET]: ''
// }
//
// export const SHIBASWAP_SUSHI_FETCH_ADDRESS: { [chainId in ChainId]: string } = {
//     [ChainId.MAINNET]: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
//     [ChainId.ROPSTEN]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.RINKEBY]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.GÖRLI]: '0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c',
//     [ChainId.KOVAN]: '0x0c7d4ABd92eAAA91Caf8447666D7244B6474ca89',
//     [ChainId.FANTOM]: '',
//     [ChainId.FANTOM_TESTNET]: '',
//     [ChainId.MATIC]: '',
//     [ChainId.MATIC_TESTNET]: '',
//     [ChainId.XDAI]: '',
//     [ChainId.BSC]: '',
//     [ChainId.BSC_TESTNET]: '',
//     [ChainId.ARBITRUM]: '',
//     [ChainId.MOONBASE]: '',
//     [ChainId.AVALANCHE]: '',
//     [ChainId.FUJI]: '',
//     [ChainId.HECO]: '',
//     [ChainId.HECO_TESTNET]: '',
//     [ChainId.HARMONY]: '',
//     [ChainId.HARMONY_TESTNET]: ''
// }
//
// // Mostly not needed
// export const SHIBASWAP_LP_TOKEN_ADDRESS: { [chainId in ChainId]: string } = {
//     [ChainId.MAINNET]: '',
//     [ChainId.ROPSTEN]: '',
//     [ChainId.RINKEBY]: '',
//     [ChainId.GÖRLI]: '',
//     [ChainId.KOVAN]: '0xccb8244D87A5d7a48d07f311eE09808b5977a00b',
//     [ChainId.FANTOM]: '',
//     [ChainId.FANTOM_TESTNET]: '',
//     [ChainId.MATIC]: '',
//     [ChainId.MATIC_TESTNET]: '',
//     [ChainId.XDAI]: '',
//     [ChainId.BSC]: '',
//     [ChainId.BSC_TESTNET]: '',
//     [ChainId.ARBITRUM]: '',
//     [ChainId.MOONBASE]: '',
//     [ChainId.AVALANCHE]: '',
//     [ChainId.FUJI]: '',
//     [ChainId.HECO]: '',
//     [ChainId.HECO_TESTNET]: '',
//     [ChainId.HARMONY]: '',
//     [ChainId.HARMONY_TESTNET]: ''
// }


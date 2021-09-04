import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const NULL_CALL_RESULT_VALUE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

export const ADDRESS_ZERO = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const BIG_DECIMAL_1E6 = BigDecimal.fromString("1e6");

export const BIG_DECIMAL_1E12 = BigDecimal.fromString("1e12");

export const BIG_DECIMAL_1E18 = BigDecimal.fromString("1e18");

export const BIG_DECIMAL_ZERO = BigDecimal.fromString("0");

export const BIG_DECIMAL_ONE = BigDecimal.fromString("1");

export const BIG_INT_ONE = BigInt.fromI32(1);

export const BIG_INT_TWO = BigInt.fromI32(2);

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100);

export const BIG_INT_ONE_DAY_SECONDS = BigInt.fromI32(86400);

export const BIG_INT_ZERO = BigInt.fromI32(0);

export const LOCKUP_POOL_NUMBER = BigInt.fromI32(29);

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148);

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000);

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK =
  BigInt.fromI32(10750005);

export const ACC_SUSHI_PRECISION = BigInt.fromString("1000000000000");

export const BENTOBOX_DEPOSIT = "deposit";

export const BENTOBOX_TRANSFER = "transfer";

export const BENTOBOX_WITHDRAW = "withdraw";

export const KASHI_PAIR_MEDIUM_RISK_TYPE = "medium";

export const PAIR_ADD_COLLATERAL = "addCollateral";

export const PAIR_REMOVE_COLLATERAL = "removeCollateral";

export const PAIR_ADD_ASSET = "addAsset";

export const PAIR_REMOVE_ASSET = "removeAsset";

export const PAIR_BORROW = "borrow";

export const PAIR_REPAY = "repay";

export const FACTORY_ADDRESS = Address.fromString("0xc35dadb65012ec5796536bd9864ed8773abc74c4");

export const MASTER_CHEF_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000" 
);

export const MASTER_CHEF_V2_ADDRESS = Address.fromString(
  "0xef0881ec094552b2e128cf945ef17a6752b4ec5d"
);

export const SUSHI_BAR_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000");

export const SUSHI_MAKER_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const SUSHI_TOKEN_ADDRESS = Address.fromString(
  "0xd4d42f0b6def4ce0383636770ef773390d85c61a"
);

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const USDC_WETH_PAIR = "0x905dfcd5649217c42684f23958568e533c711aa3";

export const DAI_WETH_PAIR = "0x0000000000000000000000000000000000000000";

export const USDT_WETH_PAIR = "0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad";

export const SUSHI_USDT_PAIR = "0x0000000000000000000000000000000000000000";

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  "1000"
);

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString(
  "1"
);

export const WETH_ADDRESS = Address.fromString("0x82af49447d8a07e3bd95bd0d56f35241523fbab1");

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const USDT_ADDRESS = Address.fromString("0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9");

export const UNISWAP_FACTORY_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString("0x74c764d41b77dbbb4fe771dab1939b00b146894a");

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString(
  "0xa010ee0226cd071bebd8919a1f675caE1f1f5d3e"
);

// MiniChef
export const MINI_CHEF_ADDRESS = Address.fromString("0xf4d73326c13a4fc5fd7a064217e12780e9bd62c3");

export const COMPLEX_REWARDER = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const CONVEX_REWARDERS: Array<Address> = [Address.fromString('0x9e01aac4b3e8781a85b21d9d9f848e72af77b362'), Address.fromString('0x1fd97b5e5a257b0b9b9a42a96bb8870cbdd1eb79')]

export const ALCX_REWARDER = Address.fromString('0x7519c93fc5073e15d89131fd38118d73a72370f8')

export const NATIVE = Address.fromString("0x82af49447d8a07e3bd95bd0d56f35241523fbab1");

export const USDC = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8";

export const USDT = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9";

export const DAI = "0x0000000000000000000000000000000000000000";

export const WHITELIST: string[] = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1,0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9,0xff970a61a04b1ca14834a43f5de4533ebddb5cc8,0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f".split(",");

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

const CUSTOM_BASES = new Map<string,string>();
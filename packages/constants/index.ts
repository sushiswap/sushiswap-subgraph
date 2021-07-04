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

export const FACTORY_ADDRESS = Address.fromString("0xc35DADB65012eC5796536bD9864eD8773aBc74C4");

export const MASTER_CHEF_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const MASTER_CHEF_V2_ADDRESS = Address.fromString(
  "0xef0881ec094552b2e128cf945ef17a6752b4ec5d" || ADDRESS_ZERO.toString()
);

export const SUSHI_BAR_ADDRESS = Address.fromString("" || ADDRESS_ZERO.toString());

export const SUSHI_MAKER_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const SUSHI_TOKEN_ADDRESS = Address.fromString(
  "0x39cf1bd5f15fb22ec3d9ff86b0727afc203427cc" || ADDRESS_ZERO.toString()
);

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString(
  ""
);

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const USDC_WETH_PAIR = "0x0000000000000000000000000000000000000000";

export const DAI_WETH_PAIR = "0x034c1b19dab61b5de448efc1e10a2e592725c893";

export const USDT_WETH_PAIR = "0x47f1c2a9c9027a10c3b13d1c40dd976c5014339b";

export const SUSHI_USDT_PAIR = "";

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  "3000" || ADDRESS_ZERO.toString()
);

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString(
  "1000" || ADDRESS_ZERO.toString()
);

export const WETH_ADDRESS = Address.fromString("0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15");

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const USDT_ADDRESS = Address.fromString("0xde3a24028580884448a5397872046a019649b084" || ADDRESS_ZERO.toString());

export const UNISWAP_FACTORY_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK =
  BigInt.fromI32(10750005);

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString("");

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString(
  "" || ADDRESS_ZERO.toString()
);

// MiniChef
export const MINI_CHEF_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000" || ADDRESS_ZERO.toString());

export const COMPLEX_REWARDER = Address.fromString(
  "0x0000000000000000000000000000000000000000"  || ADDRESS_ZERO.toString()
);

export const NATIVE = Address.fromString("0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7" || ADDRESS_ZERO.toString());

export const USDC = "0x0000000000000000000000000000000000000000";

export const USDT = "0xde3a24028580884448a5397872046a019649b084";

export const DAI = "0xba7deebbfc5fa1100fb055a87773e1e99cd3507a";

export const WHITELIST: string[] = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7,0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab,0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15,0xde3a24028580884448a5397872046a019649b084,0xba7deebbfc5fa1100fb055a87773e1e99cd3507a".split(",");

// export const WHITELIST: string[] = [
//   "0x471ece3750da237f93b8e339c536989b8978a438",
//   "0xd629eb00deced2a080b7ec630ef6ac117e614f1b",
//   "0x765de816845861e75a25fca122bb6898b8b1282a",
//   "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73"
// ];

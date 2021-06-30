import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

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

export const FACTORY_ADDRESS = Address.fromString("0xc35dadb65012ec5796536bd9864ed8773abc74c4");

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148);

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
  "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a"
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

export const NULL_CALL_RESULT_VALUE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

export const USDC_WETH_PAIR = "0xbf255d8c30dbab84ea42110ea7dc870f01c0013a";

export const DAI_WETH_PAIR = "0x194f4a320cbda15a0910d1ae20e0049cdc50916e";

export const USDT_WETH_PAIR = "0x2c7862b408bb3dbff277110ffde1b4eaa45c692a";

export const SUSHI_USDT_PAIR = "0x0000000000000000000000000000000000000000";

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("1000");

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("8000");

export const WETH_ADDRESS = Address.fromString("0x6983d1e6def3690c4d616b13597a09e6193ea013");

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  "0x5ef7622cf0d40bde750987031f614a9032911152"
);

export const USDT_ADDRESS = Address.fromString("0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f");

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000);

export const UNISWAP_FACTORY_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK =
  BigInt.fromI32(10750005);

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
export const BENTOBOX_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000");

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

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

// MiniChef
export const MINI_CHEF_ADDRESS = Address.fromString("0x67da5f2ffaddff067ab9d5f025f8810634d84287");

export const ACC_SUSHI_PRECISION = BigInt.fromString("1000000000000");

// Matic Complex Rewarder (note: putting here for now since we don't need to fill in every config file with this address)
export const MATIC_COMPLEX_REWARDER = Address.fromString(
  "0x25836011bbc0d5b6db96b20361a474cbc5245b45"
);

export const WMATIC_ADDRESS = Address.fromString(
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
);

export const WNATIVE_ADDRESS = Address.fromString(
  "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a"
);

export const COMPLEX_REWARDER = Address.fromString(
  "0x25836011bbc0d5b6db96b20361a474cbc5245b45"
);

export const USDC = "0x985458e523db3d53125813ed68c274899e9dfab4";

export const USDT = "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f";

export const DAI = "0xef977d2f931c1978db5f6747666fa1eacb0d0339";

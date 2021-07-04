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

export const FACTORY_ADDRESS = Address.fromString("{{ factory.address }}");

export const MASTER_CHEF_ADDRESS = Address.fromString(
  "{{ masterchef_address }}" || ADDRESS_ZERO.toString()
);

export const MASTER_CHEF_V2_ADDRESS = Address.fromString(
  "0xef0881ec094552b2e128cf945ef17a6752b4ec5d" || ADDRESS_ZERO.toString()
);

export const SUSHI_BAR_ADDRESS = Address.fromString("{{ sushi_bar_address }}" || ADDRESS_ZERO.toString());

export const SUSHI_MAKER_ADDRESS = Address.fromString(
  "{{ sushi_maker_address }}" || ADDRESS_ZERO.toString()
);

export const SUSHI_TOKEN_ADDRESS = Address.fromString(
  "{{ sushi_token_address }}" || ADDRESS_ZERO.toString()
);

export const SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  "{{ sushi_usdt_pair_address }}" || ADDRESS_ZERO.toString()
);

export const XSUSHI_USDC_PAIR_ADDRESS = Address.fromString(
  "{{ xsushi_usdc_pair_address }}" || ADDRESS_ZERO.toString()
);

export const XSUSHI_WETH_PAIR_ADDRESS = Address.fromString(
  "{{ xsushi_weth_pair_address }}"
);

export const SUSHI_DISTRIBUTOR_ADDRESS = Address.fromString(
  "{{ sushi_distributor_address }}" || ADDRESS_ZERO.toString()
);

export const USDC_WETH_PAIR = "{{ usdc_weth_pair }}";

export const DAI_WETH_PAIR = "{{ dai_weth_pair }}";

export const USDT_WETH_PAIR = "{{ usdt_weth_pair }}";

export const SUSHI_USDT_PAIR = "{{ sushi_usdt_pair }}";

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  "{{ minimum_usd_threshold_new_pairs }}" || ADDRESS_ZERO.toString()
);

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString(
  "{{ minimum_liquidity_threshold_eth }}" || ADDRESS_ZERO.toString()
);

export const WETH_ADDRESS = Address.fromString("{{ weth_address }}");

export const SUSHISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  "{{ sushiswap_weth_usdt_pair_address }}" || ADDRESS_ZERO.toString()
);

export const USDT_ADDRESS = Address.fromString("{{ usdt_address }}" || ADDRESS_ZERO.toString());

export const UNISWAP_FACTORY_ADDRESS = Address.fromString(
  "{{ uniswap_factory_address }}" || ADDRESS_ZERO.toString()
);

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK =
  BigInt.fromI32(10750005);

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  "{{ uniswap_weth_usdt_pair_address }}" || ADDRESS_ZERO.toString()
);

export const UNISWAP_SUSHI_ETH_PAIR_ADDRESS = Address.fromString(
  "{{ uniswap_sushi_eth_pair_address }}" || ADDRESS_ZERO.toString()
);

export const UNISWAP_SUSHI_USDT_PAIR_ADDRESS = Address.fromString(
  "{{ uniswap_sushi_usdt_pair_address }}" || ADDRESS_ZERO.toString()
);

// Bentobox constants
export const BENTOBOX_ADDRESS = Address.fromString("{{ bentobox_address }}");

export const KASHI_PAIR_MEDIUM_RISK_MASTER_ADDRESS = Address.fromString(
  "{{ kashi_pair_medium_risk_master_address }}" || ADDRESS_ZERO.toString()
);

// MiniChef
export const MINI_CHEF_ADDRESS = Address.fromString("{{ minichef_address }}" || ADDRESS_ZERO.toString());

export const COMPLEX_REWARDER = Address.fromString(
  "{{ complex_rewarder_address }}"  || ADDRESS_ZERO.toString()
);

export const NATIVE = Address.fromString("{{ native_address }}" || ADDRESS_ZERO.toString());

export const USDC = "{{ usdc_address }}";

export const USDT = "{{ usdt_address }}";

export const DAI = "{{ dai_address }}";

export const WHITELIST: string[] = "{{ whitelist }}".split(",");

// export const WHITELIST: string[] = [
//   "0x471ece3750da237f93b8e339c536989b8978a438",
//   "0xd629eb00deced2a080b7ec630ef6ac117e614f1b",
//   "0x765de816845861e75a25fca122bb6898b8b1282a",
//   "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73"
// ];

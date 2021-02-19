# SwipeSwap Subgraph

Aims to deliver analytics & historical data for SwipeSwap. Still a work in progress. Feel free to contribute!

The Graph exposes a GraphQL endpoint to query the events and entities within the SwipeSwap ecosytem.

Currently there are two subgraphs, but additional subgraphs can be added to this repo:

1. **SwipeSwap**: Currently only has support for current MasterChef and MasterChefPool data: https://thegraph.com/explorer/subgraph/swipewallet/swipeswap

2. **SwipeSwap-SubGraph-Fork** (on uniswap-fork branch): Indexes the SwipeSwap Factory, includes Price Data, Pricing, etc: https://thegraph.com/explorer/subgraph/zippoxer/swipeswap-subgraph-fork

3. **Swipe Bar**: Indexes the SwipeBar, includes data related to the bar: https://thegraph.com/explorer/subgraph/swipewallet/swipe-bar

## To setup and deploy

For any of the subgraphs: `swipeswap` or `bar` as `[subgraph]`

1. Run the `yarn run codegen:[subgraph]` command to prepare the TypeScript sources for the GraphQL (generated/schema) and the ABIs (generated/[ABI]/\*)
2. [Optional] run the `yarn run build:[subgraph]` command to build the subgraph. Can be used to check compile errors before deploying.
3. Run `graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`
4. Deploy via `yarn run deploy:[subgraph]`.

## To query these subgraphs

Please use our node utility: [swipe-data](https://github.com/SwipeWallet/swipe-data).

Note: This is in on going development as well.

## Example Queries

We will add to this as development progresses.

### Maker

```graphql
{
  maker(id: "0x6684977bbed67e101bb80fc07fccfba655c0a64f") {
    id
    servings(orderBy: timestamp) {
      id
      server {
        id
      }
      tx
      pair
      token0
      token1
      swipeServed
      block
      timestamp
    }
  }
  servers {
    id
    swipeServed
    servings(orderBy: timestamp) {
      id
      server {
        id
      }
      tx
      pair
      token0
      token1
      swipe
      block
      timestamp
    }
  }
}
```

# Community Subgraphs

1) croco-finance fork of this repo with slight modifications - [deployment](https://thegraph.com/explorer/subgraph/benesjan/swipe-swap), [code](https://github.com/croco-finance/swipeswap-subgraph)
2) croco-finance dex-rewards-subgraph which tracks SLPs in MasterChef and all the corresponding rewards individually. (can be used for analysis of user's positions) - [deployment](https://thegraph.com/explorer/subgraph/benesjan/dex-rewards-subgraph), [code](https://github.com/croco-finance/dex-rewards-subgraph)

# SushiSwap Subgraph

Aims to deliver analytics & historical data for SushiSwap. Still a work in progress. Feel free to contribute!

The Graph exposes a GraphQL endpoint to query the events and entities within the SushiSwap ecosytem.

Currently there are two subgraphs, but additional subgraphs can be added to this repo:

1. **SushiSwap**: Currently only has support for current MasterChef and MasterChefPool data: https://thegraph.com/explorer/subgraph/sushiswap/sushiswap

2. **SushiSwap-SubGraph-Fork** (on uniswap-fork branch): Indexes the SushiSwap Factory, includes Price Data, Pricing, etc: https://thegraph.com/explorer/subgraph/zippoxer/sushiswap-subgraph-fork

3. **Sushi Bar**: Indexes the SushiBar, includes data related to the bar: https://thegraph.com/explorer/subgraph/sushiswap/sushi-bar

## To setup and deploy

For any of the subgraphs: `sushiswap` or `bar` as `[subgraph]`

1. Run the `yarn run codegen:[subgraph]` command to prepare the TypeScript sources for the GraphQL (generated/schema) and the ABIs (generated/[ABI]/\*)
2. [Optional] run the `yarn run build:[subgraph]` command to build the subgraph. Can be used to check compile errors before deploying.
3. Run `graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`
4. Deploy via `yarn run deploy:[subgraph]`.

## To query these subgraphs

Please use our node utility: [sushi-data](https://github.com/sushiswap/sushi-data).

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
      sushiServed
      block
      timestamp
    }
  }
  servers {
    id
    sushiServed
    servings(orderBy: timestamp) {
      id
      server {
        id
      }
      tx
      pair
      token0
      token1
      sushi
      block
      timestamp
    }
  }
}
```

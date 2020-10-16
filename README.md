# SushiSwap Subgraph

Aims to deliver analytics & historical data for SushiSwap. Still a work in progress. Feel free to contribute!

The Graph exposes a GraphQL endpoint to query the events and entities within the SushiSwap ecosytem.

Currently there is only a single subgraph, but additional subgraphs can be added to this repo:

1. **SushiSwap**: Currently only has support for current MasterChef and MasterChefPool data: https://thegraph.com/explorer/subgraph/sushiswap/sushiswap

## To setup and deploy

For any of the subgraphs: `sushiswap` as `[subgraph]`

1. Run the `yarn run codegen:[subgraph]` command to prepare the TypeScript sources for the GraphQL (generated/schema) and the ABIs (generated/[ABI]/\*)
2. [Optional] run the `yarn run build:[subgraph]` command to build the subgraph. Can be used to check compile errors before deploying.
3. Run `graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`
4. Deploy via `yarn run deploy:[subgraph]`.

## To query these subgraphs

Please use our node utility: [sushi-data](https://github.com/sushiswap/sushi-data).

Note: This is in on going development as well.

## Example Queries

We will add to this as development progresses.

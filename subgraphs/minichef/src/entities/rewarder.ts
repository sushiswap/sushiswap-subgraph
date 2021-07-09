import { ADDRESS_ZERO, BIG_INT_ZERO, COMPLEX_REWARDER, NATIVE } from "const";
import { Address, ethereum } from "@graphprotocol/graph-ts";

import { ComplexRewarderTime as ComplexRewarderTemplate } from "../../generated/templates";
import { Rewarder } from "../../generated/schema";

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
  let rewarder = Rewarder.load(address.toHex());

  if (rewarder === null) {
    rewarder = new Rewarder(address.toHex());
    rewarder.rewardToken = ADDRESS_ZERO;
    rewarder.rewardPerSecond = BIG_INT_ZERO;

    if (address == COMPLEX_REWARDER) {
      rewarder.rewardPerSecond = BIG_INT_ZERO;
      rewarder.rewardToken = NATIVE;
      ComplexRewarderTemplate.create(address);
    }
  }

  rewarder.timestamp = block.timestamp;
  rewarder.block = block.number;
  rewarder.save();

  return rewarder as Rewarder;
}

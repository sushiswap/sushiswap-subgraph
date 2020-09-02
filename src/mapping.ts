import { BigInt } from "@graphprotocol/graph-ts";
import {
  MasterChef,
  Deposit,
  EmergencyWithdraw,
  OwnershipTransferred,
  Withdraw,
  AddCall,
  SetCall,
} from "../generated/MasterChef/MasterChef";
import { MasterChefPool } from "../generated/schema";

export function handleDeposit(event: Deposit): void {}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleWithdraw(event: Withdraw): void {}

export function handleAddPool(event: AddCall): void {
  let masterChef = MasterChef.bind(event.to);

  let poolId = masterChef.poolLength().minus(BigInt.fromI32(1));
  let poolInfo = masterChef.poolInfo(poolId);

  let pool = new MasterChefPool(poolId.toString());
  pool.balance = BigInt.fromI32(0);
  pool.lpToken = poolInfo.value0;
  pool.allocPoint = poolInfo.value1;
  pool.lastRewardBlock = poolInfo.value2;
  pool.accSushiPerShare = poolInfo.value3;

  pool.save();
}

export function handleSetPoolAllocPoint(event: SetCall): void {
  let pool = MasterChefPool.load(event.inputs._pid.toString());
  pool.allocPoint = event.inputs._allocPoint;
  pool.save();
}

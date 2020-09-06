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
import {
  MasterChef as MasterChefEntity,
  MasterChefPool,
  MasterChefPoolData,
} from "../generated/schema";

// Seconds apart between stored data entries.
const dataInterval = 60 * 15;

export function handleDeposit(event: Deposit): void {
  let pool = MasterChefPool.load(event.params.pid.toString());
  pool.balance = pool.balance.plus(event.params.amount);
  pool.save();

  updatePoolData(pool as MasterChefPool, event.block.timestamp.toI32());
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  let pool = MasterChefPool.load(event.params.pid.toString());
  pool.balance = pool.balance.minus(event.params.amount);
  pool.save();

  updatePoolData(pool as MasterChefPool, event.block.timestamp.toI32());
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleWithdraw(event: Withdraw): void {
  let pool = MasterChefPool.load(event.params.pid.toString());
  pool.balance = pool.balance.minus(event.params.amount);
  pool.save();

  updatePoolData(pool as MasterChefPool, event.block.timestamp.toI32());
}

export function handleAddPool(event: AddCall): void {
  let masterChef = MasterChef.bind(event.to);

  let poolId = masterChef.poolLength().minus(BigInt.fromI32(1));
  let poolInfo = masterChef.poolInfo(poolId);

  // Add pool.
  let pool = new MasterChefPool(poolId.toString());
  pool.balance = BigInt.fromI32(0);
  pool.lpToken = poolInfo.value0;
  pool.allocPoint = poolInfo.value1;
  pool.lastRewardBlock = poolInfo.value2;
  pool.accSushiPerShare = poolInfo.value3;
  pool.addedAt = event.block.timestamp.toI32();
  pool.save();

  // Update MasterChefEntity.
  let masterChefEntity = getMasterChefEntity();
  masterChefEntity.totalAllocPoint = masterChefEntity.totalAllocPoint.plus(
    pool.allocPoint
  );
  masterChefEntity.save();
}

export function handleSetPoolAllocPoint(event: SetCall): void {
  let pool = MasterChefPool.load(event.inputs._pid.toString());

  // Update MasterChefEntity.
  let masterChefEntity = getMasterChefEntity();
  masterChefEntity.totalAllocPoint = masterChefEntity.totalAllocPoint.plus(
    event.inputs._allocPoint.minus(pool.allocPoint)
  );
  masterChefEntity.save();

  // Update pool.
  pool.allocPoint = event.inputs._allocPoint;
  pool.save();
}

function updatePoolData(pool: MasterChefPool, timestamp: i32): void {
  let quarterHourIndex = (timestamp / dataInterval) * dataInterval;
  let poolDataId = pool.id + "-" + quarterHourIndex.toString();
  let poolData = MasterChefPoolData.load(poolDataId);

  if (poolData === null) {
    poolData = new MasterChefPoolData(poolDataId);
    poolData.pool = pool.id;
    poolData.timestamp = timestamp;
  }

  let totalAllocPoint = getMasterChefEntity().totalAllocPoint;
  poolData.allocShare = pool.allocPoint.div(totalAllocPoint);
  poolData.balance = pool.balance;

  poolData.save();
}

function getMasterChefEntity(): MasterChefEntity {
  let entity = MasterChefEntity.load("1");

  if (entity === null) {
    entity = new MasterChefEntity("1");
    entity.totalAllocPoint = BigInt.fromI32(0);
    entity.save();
  }

  return entity as MasterChefEntity;
}

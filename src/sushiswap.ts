import { BigInt, Address, ethereum, log } from "@graphprotocol/graph-ts"
import {
  MasterChef,
  Deposit,
  EmergencyWithdraw,
  Withdraw,
  SetCall
} from "../generated/MasterChef/MasterChef"

import {
  MasterChef as MasterChefEntity,
  MasterChefPool,
} from "../generated/schema";

const CHEF_ADDY = '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd'

export function handleDeposit(event: Deposit): void {
  let pool = getPoolEntity(event.params.pid, event.block);
  pool.balance = pool.balance + event.params.amount;
  pool.save();
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  let pool = getPoolEntity(event.params.pid, event.block);
  pool.balance = pool.balance - event.params.amount;
  pool.save();
}

export function handleWithdraw(event: Withdraw): void {
  let pool = getPoolEntity(event.params.pid, event.block);
  pool.balance = pool.balance - event.params.amount;
  pool.save();
}

export function handleSetPoolAllocPoint(event: SetCall): void {
  let masterChef = MasterChef.bind(event.to);
  let pool = getPoolEntity(event.inputs._pid, event.block);

  // Update MasterChefEntity
  let masterChefEntity = getMasterChefEntity();
  masterChefEntity.totalAllocPoint = masterChef.totalAllocPoint();
  masterChefEntity.save();

  // Update pool
  pool.allocPoint = event.inputs._allocPoint;
  pool.save();
}

function getPoolEntity(poolId: BigInt, block: ethereum.Block): MasterChefPool {
  let masterChef = MasterChef.bind(Address.fromString(CHEF_ADDY));
  let pool = MasterChefPool.load(poolId.toString());
  let poolInfo = masterChef.poolInfo(poolId);

  if (pool == null) {
    // init new pool entity
    pool = new MasterChefPool(poolId.toString());
    pool.balance = BigInt.fromI32(0);
    pool.addedBlock = block.number;
    pool.addedTs = block.timestamp;

    //update MasterChefEntity
    let masterChefEntity = getMasterChefEntity();
    masterChefEntity.poolLength = masterChef.poolLength();
    masterChefEntity.totalAllocPoint = masterChef.totalAllocPoint();
    masterChefEntity.save()
  }

  // Update pool
  pool.lpToken = poolInfo.value0;
  pool.allocPoint = poolInfo.value1;
  pool.lastRewardBlock = poolInfo.value2;
  pool.accSushiPerShare = poolInfo.value3;

  pool.save()

  return pool as MasterChefPool;
}

function getMasterChefEntity(): MasterChefEntity {
  let entity = MasterChefEntity.load("1");

  if (entity == null) {
    entity = new MasterChefEntity("1");
    entity.totalAllocPoint = BigInt.fromI32(0);
    entity.poolLength = BigInt.fromI32(0);
    entity.save();
  }

  return entity as MasterChefEntity;
}

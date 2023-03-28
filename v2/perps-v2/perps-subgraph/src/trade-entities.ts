import { PositionModified as PositionModifiedEvent } from '../generated/PerpsV2ProxyAAVEPERP/PerpsV2Proxy';
import { FuturesTrade } from '../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';

function createBaseTradeEntity(event: PositionModifiedEvent, positionId: string): FuturesTrade {
  const tradeEntity = new FuturesTrade(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );
  tradeEntity.timestamp = event.block.timestamp;
  tradeEntity.account = event.params.account;
  tradeEntity.positionId = positionId;
  tradeEntity.margin = event.params.margin.plus(event.params.fee);
  tradeEntity.size = event.params.tradeSize;
  tradeEntity.positionSize = event.params.size;
  tradeEntity.market = event.address.toHex();
  tradeEntity.price = event.params.lastPrice;
  tradeEntity.feesPaidToSynthetix = event.params.fee;
  tradeEntity.txHash = event.transaction.hash.toHex();
  return tradeEntity;
}
export function createTradeEntityForNewPosition(
  event: PositionModifiedEvent,
  positionId: string
): void {
  let tradeEntity = createBaseTradeEntity(event, positionId);
  tradeEntity.pnl = event.params.fee.times(BigInt.fromI32(-1));
  tradeEntity.positionClosed = false;
  tradeEntity.type = 'PositionOpened';
  tradeEntity.save();
}
export function createTradeEntityForPositionClosed(
  event: PositionModifiedEvent,
  positionId: string,
  pnl: BigInt
): void {
  let tradeEntity = createBaseTradeEntity(event, positionId);
  tradeEntity.pnl = pnl;
  tradeEntity.positionClosed = true;
  tradeEntity.type = 'PositionClosed';
  tradeEntity.save();
}

export function createTradeEntityForPositionModification(
  event: PositionModifiedEvent,
  positionId: string,
  pnl: BigInt
): void {
  let tradeEntity = createBaseTradeEntity(event, positionId);
  tradeEntity.pnl = pnl;
  tradeEntity.positionClosed = false;
  tradeEntity.type = 'PositionModified';
  tradeEntity.save();
}

export function createTradeEntityForLiquidation(
  event: PositionModifiedEvent,
  positionId: string,
  pnl: BigInt
): void {
  // temporarily set the pnl to the difference in the position pnl
  // we will add liquidation fees during the PositionLiquidated handler
  const tradeEntity = createBaseTradeEntity(event, positionId);
  tradeEntity.margin = BigInt.fromI32(0);
  tradeEntity.market = event.address.toHex();
  tradeEntity.size = BigInt.fromI32(0);
  tradeEntity.positionId = positionId;
  tradeEntity.positionSize = BigInt.fromI32(0);
  tradeEntity.positionClosed = true;
  tradeEntity.pnl = pnl;
  tradeEntity.type = 'Liquidated';

  tradeEntity.save();
}

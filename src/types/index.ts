import {
  DepositCollateralUserMessage,
  RepayStablecoinUserMessage,
  WithdrawCollateralUserMessage,
  WithdrawStablecoinUserMessage,
} from '../contracts/GateKeeperContract';

export type CollateralAction = 'deposit' | 'withdraw';

export type StableAction = 'borrow' | 'repay';

export type Action = CollateralAction | StableAction;

export type Message =
  | DepositCollateralUserMessage
  | WithdrawCollateralUserMessage
  | WithdrawStablecoinUserMessage
  | RepayStablecoinUserMessage;

export type MessageType =
  | 'DepositCollateralUserMessage'
  | 'WithdrawCollateralUserMessage'
  | 'WithdrawStablecoinUserMessage'
  | 'RepayStablecoinUserMessage';

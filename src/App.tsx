import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';

import { useTonConnect } from './hooks/useTonConnect';
import useBalance from './hooks/useBalance';
import useMessage from './hooks/useMessage';
import useGateKeeper from './hooks/useGateKeeper';
import useUserStablecoinWallet from './hooks/useUserStablecoinWallet';
import useUserPosition from './hooks/useUserPosition';

import TransactionForm from './components/TransactionForm';
import {
  Action,
  CollateralAction,
  Message,
  MessageType,
  StableAction,
} from './types';
import { Address, toNano } from 'ton-core';
import { toFixed } from './utils';
import { useForm } from 'react-hook-form';

function App() {
  const { resetField } = useForm();
  const { connected } = useTonConnect();
  const address = useTonAddress();
  const balance = useBalance();
  useMessage(address);

  const { debtRate, tonPrice, send } = useGateKeeper();
  const { collateral, debt } = useUserPosition(address);
  const { stableBalance } = useUserStablecoinWallet(address);
  const collateralVolume = collateral && tonPrice ? collateral * tonPrice : 0;

  const stablesBorrowed =
    debt && debtRate ? debt * debtRate.debtAccumulatedRate : 0;

  const liquidationRation = 1.2;
  const LTV = 1.5;

  const rawHealthFactor =
    collateralVolume / (stablesBorrowed * liquidationRation);

  const healthFactor =
    !isNaN(rawHealthFactor) && isFinite(rawHealthFactor) ? rawHealthFactor : 0;

  const isHealthFactorLow = healthFactor < 1 && healthFactor !== 0;

  const maxWithdraw = collateralVolume - stablesBorrowed * LTV;
  const maxBorrow = collateralVolume / LTV - stablesBorrowed;

  const isAvailable = (action: Action) => {
    if (!connected || isHealthFactorLow) return false;
  };

  const [activeCollateralAction, setActiveCollateralAction] =
    useState<CollateralAction>('deposit');

  const [activeStableAction, setActiveStableAction] =
    useState<StableAction>('borrow');

  const handleSubmit = (action: Action, amount: number) => {
    const type = {
      deposit: 'DepositCollateralUserMessage',
      withdraw: 'WithdrawCollateralUserMessage',
      borrow: 'WithdrawStablecoinUserMessage',
      repay: 'RepayStablecoinUserMessage',
    };

    const value =
      type[action] === type.deposit
        ? toNano((1 + amount).toString())
        : toNano('0.3');

    const message = {
      $$type: type[action] as MessageType,
      user: Address.parse(address),
      amount: toNano(amount.toString()),
    };

    send(value, message);
  };

  return (
    <div className="grid h-screen place-content-center bg-white">
      <Toaster />
      <div className="container w-screen max-w-xl rounded-2xl p-7 shadow">
        <div className="flex flex-col gap-2">
          <header className="flex justify-between">
            <div className="flex items-center gap-3">
              <img src="/ton.svg" className="w-[54px]"></img>
              <div className="">
                <div className="text-xl font-semibold">{balance} TON</div>
                <div>{stableBalance} StableTON</div>
              </div>
            </div>
            <TonConnectButton />
          </header>
          <div className="mt-2 flex gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                <CardValue label="TON Price">{tonPrice} $</CardValue>
                <CardValue label="TON Deposited">{collateral} TON</CardValue>
                <CardValue label="Collateral volume">
                  {collateralVolume} $
                </CardValue>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                <CardValue label="Stable borrowed">
                  {stablesBorrowed} $
                </CardValue>
                <CardValue label="Health factor" isDanger={isHealthFactorLow}>
                  {toFixed(healthFactor, 2).toString()}
                </CardValue>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex rounded-xl bg-slate-100 p-1">
                <TabButton
                  action="deposit"
                  onClick={() => setActiveCollateralAction('deposit')}
                  isActive={activeCollateralAction === 'deposit'}
                />
                <TabButton
                  action="withdraw"
                  onClick={() => setActiveCollateralAction('withdraw')}
                  isActive={activeCollateralAction === 'withdraw'}
                />
              </div>
              <TransactionForm
                action={activeCollateralAction}
                onSubmit={handleSubmit}
                disabled={!isAvailable(activeCollateralAction)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex rounded-xl bg-slate-100 p-1">
                <TabButton
                  action="borrow"
                  onClick={() => setActiveStableAction('borrow')}
                  isActive={activeStableAction === 'borrow'}
                />
                <TabButton
                  action="repay"
                  onClick={() => setActiveStableAction('repay')}
                  isActive={activeStableAction === 'repay'}
                />
              </div>
              <TransactionForm
                action={activeStableAction}
                onSubmit={handleSubmit}
                disabled={!isAvailable(activeStableAction)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type TabButtonProps = {
  action: Action;
  onClick: () => void;
  isActive: boolean;
};

const TabButton = ({ action, onClick, isActive }: TabButtonProps) => {
  const button =
    'w-full font-medium rounded-lg py-2 text-slate-600 first-letter:uppercase';
  const activeButton = `${button} bg-white font-semibold cursor-default`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={isActive ? activeButton : button}
    >
      {action}
    </button>
  );
};

type CardValueProps = {
  label: string;
  isDanger?: boolean;
  children: ReactNode;
};

const CardValue = ({ label, isDanger, children }: CardValueProps) => {
  return (
    <div className="rounded-xl bg-white p-3 pl-4">
      <div className="text-sm text-slate-500">{label}</div>
      <span className={`text-lg font-semibold ${isDanger && 'text-rose-500'}`}>
        {children}
      </span>
    </div>
  );
};

export default App;

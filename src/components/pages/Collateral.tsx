import { useRef, useState } from 'react';

type CollateralProps = {
  onBack: () => void;
  onTransaction: (value: number, action: string) => void;
};

export default function Collateral({ onBack, onTransaction }: CollateralProps) {
  const [active, setActive] = useState<'deposit' | 'withdraw'>('deposit');
  const button = 'w-full rounded-lg py-2 font-medium text-gray-600';
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid h-screen place-content-center">
      <div className="container w-screen max-w-xs rounded-xl p-7 shadow">
        <div className="flex flex-col gap-2">
          <button type="button" onClick={onBack} className="self-start">
            ← Go back
          </button>
          <div className="flex gap-2 rounded-xl bg-gray-200 p-1">
            <button
              type="button"
              onClick={() => active !== 'deposit' && setActive('deposit')}
              className={active === 'deposit' ? `${button} bg-white` : button}
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => active !== 'withdraw' && setActive('withdraw')}
              className={active === 'withdraw' ? `${button} bg-white` : button}
            >
              Withdraw
            </button>
          </div>
          <input
            ref={inputRef}
            className="w-full rounded-xl border border-gray-200 py-6 px-4 text-2xl font-medium shadow-sm outline-none focus:border-gray-400"
            placeholder="0.0"
          />
          <button
            onClick={() =>
              inputRef.current && onTransaction(+inputRef.current.value, active)
            }
            className="w-full rounded-xl bg-gray-600 py-3 font-medium text-white"
          >
            {active === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
}

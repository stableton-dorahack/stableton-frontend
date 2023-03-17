import { useRef, useState } from 'react';

type StableProps = {
  onBack: () => void;
  onTransaction: (value: number, action: string) => void;
};

export default function Stable({ onBack, onTransaction }: StableProps) {
  const [active, setActive] = useState<'borrow' | 'repay'>('borrow');
  const button = 'w-full rounded-lg py-2 font-medium text-slate-600';
  const activeButton = `${button} bg-white`;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid h-screen place-content-center">
      <div className="container w-screen max-w-xs rounded-2xl p-7 shadow">
        <div className="flex flex-col gap-2">
          <button type="button" onClick={onBack} className="self-start">
            ← Go back
          </button>
          <div className="flex rounded-xl bg-slate-200 p-1">
            <button
              type="button"
              onClick={() => active !== 'borrow' && setActive('borrow')}
              className={active === 'borrow' ? activeButton : button}
            >
              Borrow
            </button>
            <button
              type="button"
              onClick={() => active !== 'repay' && setActive('repay')}
              className={active === 'repay' ? activeButton : button}
            >
              Repay
            </button>
          </div>
          <input
            ref={inputRef}
            className="w-full rounded-xl border border-slate-200 py-6 px-4 text-2xl font-medium shadow-sm outline-none focus:border-slate-400"
            placeholder="0.0"
          />
          <button
            onClick={() =>
              inputRef.current && onTransaction(+inputRef.current.value, active)
            }
            className="w-full rounded-xl bg-slate-600 py-3 font-medium text-white"
          >
            {active === 'borrow' ? 'Borrow' : 'Repay'}
          </button>
        </div>
      </div>
    </div>
  );
}

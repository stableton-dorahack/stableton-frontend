import { ReactNode, useEffect, useState } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { Toaster } from 'react-hot-toast';
import useUserPosition from './hooks/useUserPosition';
import useGateKeeper from './hooks/useMockGateKeeper';
import useBalance from './hooks/useBalance';
import { formatAddress, toFixed } from './utils';
import useMessage from './hooks/useMessage';
import { useTonConnect } from './hooks/useTonConnect';
import Form from './components/ActionForm';
import useUserPositionsManagerContract from './hooks/usePositionsManagerContract';

function App() {
  const { connected } = useTonConnect();
  const address = useTonAddress();
  const balance = useBalance();
  const { userPositionState } = useUserPosition();
  const { debtRate, tonPrice } = useGateKeeper();
  const [tonDeposited, setTonDeposited] = useState<number>(0);
  const [stablesBorrowed, setStablesBorrowed] = useState<number>(0);
  const collateralVolume = tonDeposited * tonPrice;
  const healthFactor = collateralVolume / (stablesBorrowed * 1.5);
  useMessage();

  const { userPositionsContractAddress } =
    useUserPositionsManagerContract(address);

  console.log('userPositionsContractAddress', userPositionsContractAddress);

  useEffect(() => {
    if (!userPositionState) return;
    const { collateral, debt } = userPositionState;
    const { debtAccumulatedRate } = debtRate;
    setTonDeposited(collateral);
    setStablesBorrowed(debt * debtAccumulatedRate);
  }, [userPositionState, debtRate]);

  const data = {
    balance: balance,
    stableBalance: toFixed(balance * Math.random(), 2),
    formattedAddress: formatAddress(address),
    tonDeposited: tonDeposited,
    tonPrice: tonPrice,
    collateralVolume: collateralVolume,
    stablesBorrowed: stablesBorrowed,
    healthFactor: healthFactor,
  };

  const isHealthFactorLow = data.healthFactor < 1;

  return (
    <div className="grid h-screen place-content-center bg-white">
      <Toaster />
      <div className="container w-screen max-w-xl rounded-2xl p-7 shadow">
        <div className="flex flex-col gap-2">
          <header className="flex justify-between">
            <div className="flex items-center gap-3">
              <img src="/ton.svg" className="w-[54px]"></img>
              <div className="">
                <div className="text-xl font-semibold">{data.balance} TON</div>
                <div className="">{data.stableBalance} StableTON</div>
              </div>
            </div>
            <TonConnectButton />
          </header>
          <div className="mt-2 flex gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                <CardValue label="TON Price">{data.tonPrice} $</CardValue>
                <CardValue label="TON Deposited">
                  {data.tonDeposited} TON
                </CardValue>
                <CardValue label="Collateral volume">
                  {data.collateralVolume} TON
                </CardValue>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                <CardValue label="Stable borrowed">
                  {data.stablesBorrowed} StableTON
                </CardValue>
                <CardValue label="Health factor" isDanger={isHealthFactorLow}>
                  {toFixed(data.healthFactor, 2).toString()}
                </CardValue>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Form className="flex-1" actions={['deposit', 'withdraw']} />
            <Form className="flex-1" actions={['borrow', 'repay']} />
          </div>
        </div>
      </div>
    </div>
  );
}

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

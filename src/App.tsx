import { useEffect, useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import toast, { Toaster } from 'react-hot-toast';
import useUserPosition from './hooks/useUserPosition';
import useGateKeeper from './hooks/useGateKeeper';
import useBalance from './hooks/useBalance';
import { formatAddress } from './utils';
import useMessage from './hooks/useMessage';
import { Home, Connect, Collateral, Stable } from './components/pages';

type Page = 'connect' | 'home' | 'collateral' | 'stable';

function App() {
  const [page, setPage] = useState<Page>('connect');
  const address = useTonAddress();
  const balance = useBalance();
  const { userPositionState } = useUserPosition();
  const { debtRate, tonPrice } = useGateKeeper();
  const [tonDeposited, setTonDeposited] = useState<number>(0);
  const [stablesBorrowed, setStablesBorrowed] = useState<number>(0);
  const collateralVolume = tonDeposited * tonPrice;
  const healthFactor = collateralVolume / (stablesBorrowed * 1.5);
  useMessage(toast);

  useEffect(() => {
    if (!userPositionState) return;
    setTonDeposited(userPositionState.collateral);
    setStablesBorrowed(userPositionState.debt * debtRate.debtAccumulatedRate);
  }, [userPositionState, debtRate]);

  if (page === 'connect') {
    return <Connect onConnect={() => setPage('home')} />;
  }

  if (page === 'collateral') {
    return (
      <Collateral
        onTransaction={(value, action) =>
          alert(`VALUE IS: ${value}\n ACTION IS: ${action}`)
        }
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'stable') {
    return (
      <Stable
        onTransaction={(value, action) =>
          alert(`VALUE IS: ${value}\n ACTION IS: ${action}`)
        }
        onBack={() => setPage('home')}
      />
    );
  }

  const data = {
    balance: balance ?? 0,
    formattedAddress: formatAddress(address),
    tonDeposited: tonDeposited,
    tonPrice: tonPrice,
    collateralVolume: collateralVolume,
    stablesBorrowed: stablesBorrowed,
    healthFactor: healthFactor,
  };

  return (
    <Home
      data={data}
      onCollateralClick={() => setPage('collateral')}
      onStableClick={() => setPage('stable')}
      Toaster={Toaster}
    />
  );
}

export default App;

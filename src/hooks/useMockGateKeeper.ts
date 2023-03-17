import { useQuery } from '@tanstack/react-query';
import { fromNano } from '../utils';

const useGateKeeper = () => {
  const gateKeeper = {
    debtRate: async () => {
      return { debtAccumulatedRate: 1_000_000_000n };
    },
    tonPrice: async () => 2_200_000_000n,
  };

  const { data } = useQuery(
    ['userPositionState'],
    async () => {
      const debtRate = await gateKeeper.debtRate();
      const tonPrice = await gateKeeper.tonPrice();
      return { debtRate, tonPrice };
    },
    { refetchInterval: 3000 }
  );

  return {
    debtRate: data?.debtRate
      ? { debtAccumulatedRate: fromNano(data?.debtRate?.debtAccumulatedRate) }
      : { debtAccumulatedRate: 0 },
    tonPrice: data?.tonPrice ? fromNano(data?.tonPrice) : 0,
  };
};

export default useGateKeeper;

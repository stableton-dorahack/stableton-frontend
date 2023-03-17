import { useQuery } from '@tanstack/react-query';
import { fromNano } from '../utils';

const useUserPosition = () => {
  const userPosition = {
    getPositionState: async () => {
      return { collateral: 2_400_000_000n, debt: 20_000_000_000n };
    },
    getMessage: async () => {
      return {
        timestamp: 17214000029n,
        value: 'Test message from contract',
      };
    },
  };

  const { data } = useQuery(
    ['userPosition'],
    async () => {
      const userPositionState = await userPosition.getPositionState();
      const message = await userPosition.getMessage();
      return { userPositionState, message };
    },
    { refetchInterval: 3000 }
  );

  const userPositionState = {
    collateral: fromNano(data?.userPositionState?.collateral ?? 0n),
    debt: fromNano(data?.userPositionState?.debt ?? 0n),
  };

  const message = {
    timestamp: Number(data?.message?.timestamp ?? 0n),
    value: data?.message?.value ?? '',
  };

  return {
    userPositionState: data?.userPositionState ? userPositionState : null,
    message: data?.message ? message : null,
  };
};

export default useUserPosition;

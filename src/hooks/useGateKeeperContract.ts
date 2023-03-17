import { useQuery } from '@tanstack/react-query';
import { fromNano, toNumber } from '../utils';
import { useAsyncInitialize } from './useAsyncInitialize';
import { GateKeeperContract } from '../contracts/GateKeeperContract';
import { useTonClient } from './useTonClient';
import { Address, OpenedContract } from 'ton-core';

const useGateKeeperContract = () => {
  const { client } = useTonClient();

  const gateKeeperContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = GateKeeperContract.fromAddress(
      Address.parse('address will be there')
    );
    return client.open(contract) as OpenedContract<GateKeeperContract>;
  }, [client]);

  const { data } = useQuery(
    ['gateKeeper'],
    async () => {
      if (!gateKeeperContract) return null;
      const debtRate = await gateKeeperContract.getDebtRate();
      const tonPrice = await gateKeeperContract.getTonPrice();
      return { debtRate, tonPrice };
    },
    { refetchInterval: 3000 }
  );

  return {
    debtRate: {
      debtAccumulatedRate: toNumber(data?.debtRate?.debtAccumulatedRate),
    },
    tonPrice: toNumber(data?.debtRate?.debtAccumulatedRate),
  };
};

export default useGateKeeperContract;

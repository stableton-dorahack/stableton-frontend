import { useQuery } from '@tanstack/react-query';
import { useAsyncInitialize } from './useAsyncInitialize';
import { GateKeeperContract } from '../contracts/GateKeeperContract';
import { useTonClient } from './useTonClient';
import { Address, OpenedContract, fromNano, toNano } from 'ton-core';
import { useTonConnect } from './useTonConnect';
import { Message } from '../types';

const useGateKeeperContract = () => {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const gateKeeperContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = GateKeeperContract.fromAddress(
      Address.parse('EQArRm3cFDU5K4XiU067vMKEleHF6mHhfEI8uk8dHlCiR1GY')
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
      debtAccumulatedRate: data
        ? +fromNano(data.debtRate.debtAccumulatedRate)
        : 0,
    },
    tonPrice: data ? +fromNano(data.tonPrice) : 0,
    send: (value: bigint, message: Message) => {
      if (!gateKeeperContract) return;
      return gateKeeperContract.send(sender, { value }, message);
    },
  };
};

export default useGateKeeperContract;

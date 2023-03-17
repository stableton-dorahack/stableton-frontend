import { useQuery } from '@tanstack/react-query';
import { useAsyncInitialize } from './useAsyncInitialize';
import { PositionsManagerContract } from '../contracts/PositionsManagerContract';
import { useTonClient } from './useTonClient';
import { Address, OpenedContract } from 'ton-core';

const useUserPositionsManagerContract = (userAddress: string) => {
  const { client } = useTonClient();

  const positionsManagerContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress = 'EQAVHV5wnhGSvdsLddTfyMNv9o3j1DhNx8R-zNxkJMRgu1wi';
    const contract = PositionsManagerContract.fromAddress(
      Address.parse(contractAddress)
    );
    return client.open(contract) as OpenedContract<PositionsManagerContract>;
  }, [client]);

  const { data } = useQuery(
    ['positionManager'],
    async () => {
      if (!positionsManagerContract) return null;

      const userPositionsContractAddress =
        await positionsManagerContract.getUserPositionAddress(
          Address.parse(userAddress)
        );

      console.log('userPositionsContractAddress', userPositionsContractAddress);

      return { userPositionsContractAddress };
    },
    { refetchInterval: 5000 }
  );

  return {
    userPositionsContractAddress: data?.userPositionsContractAddress,
  };
};

export default useUserPositionsManagerContract;

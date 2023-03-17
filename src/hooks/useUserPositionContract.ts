import { useQuery } from '@tanstack/react-query';
import { useAsyncInitialize } from './useAsyncInitialize';
import { PositionsManagerContract } from '../contracts/PositionsManagerContract';
import { UserPositionContract } from '../contracts/UserPositionContract';
import { useTonClient } from './useTonClient';
import { Address, OpenedContract } from 'ton-core';
import { toNumber } from '../utils';

const useUserPosition = (userAddress: string) => {
  const { client } = useTonClient();

  const positionsManagerContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress = 'EQAVHV5wnhGSvdsLddTfyMNv9o3j1DhNx8R-zNxkJMRgu1wi';
    const contract = PositionsManagerContract.fromAddress(
      Address.parse(contractAddress)
    );
    return client.open(contract) as OpenedContract<PositionsManagerContract>;
  }, [client]);

  const { data: userPositionContractAddress } = useQuery(
    ['positionManager'],
    async () => {
      if (!positionsManagerContract) return null;

      const userPositionContractAddress =
        await positionsManagerContract.getUserPositionAddress(
          Address.parse(userAddress)
        );

      console.log('userPositionContractAddress', userPositionContractAddress);

      return userPositionContractAddress;
    }
  );

  const userPositionContract = useAsyncInitialize(async () => {
    if (!client || !userPositionContractAddress) return null;
    const contract = UserPositionContract.fromAddress(
      userPositionContractAddress
    );
    return client.open(contract) as OpenedContract<UserPositionContract>;
  }, [client]);

  const { data } = useQuery(['positionManager'], async () => {
    if (!userPositionContract) return null;
    const userPosition = await userPositionContract.getGetPositionState();
    return userPosition;
  });

  return {
    debt: toNumber(data?.debt),
    collateral: toNumber(data?.collateral),
  };
};

export default useUserPosition;

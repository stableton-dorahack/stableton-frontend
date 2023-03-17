import { useQuery } from '@tanstack/react-query';
import { useAsyncInitialize } from './useAsyncInitialize';
import { PositionsManagerContract } from '../contracts/PositionsManagerContract';
import { UserPositionContract } from '../contracts/UserPositionContract';
import { useTonClient } from './useTonClient';
import { Address, OpenedContract, fromNano } from 'ton-core';

const useUserPositionContract = (userAddress: string) => {
  const { client } = useTonClient();

  const positionsManagerContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress = 'EQDGTxG-VaiAq5YGHuf8nASYU8_AiOm4k6Wvv23YxzrGn--k';
    const contract = PositionsManagerContract.fromAddress(
      Address.parse(contractAddress)
    );
    return client.open(contract) as OpenedContract<PositionsManagerContract>;
  }, [client]);

  const { data: userPositionContractAddress } = useQuery(
    ['positionsManager'],
    async () => {
      if (!positionsManagerContract) return null;

      const userPositionContractAddress =
        await positionsManagerContract.getUserPositionAddress(
          Address.parse(userAddress)
        );

      return userPositionContractAddress;
    },
    { enabled: !!userAddress && !!positionsManagerContract }
  );

  const userPositionContract = useAsyncInitialize(async () => {
    if (!client || !userPositionContractAddress) return null;
    const contract = UserPositionContract.fromAddress(
      userPositionContractAddress
    );

    return client.open(contract) as OpenedContract<UserPositionContract>;
  }, [client, userPositionContractAddress]);

  const { data } = useQuery(
    ['userPosition'],
    async () => {
      try {
        if (!userPositionContract) return null;
        const userPosition = await userPositionContract.getPositionState();
        const message = await userPositionContract.getMessage();
        return { ...userPosition, message };
      } catch (e) {
        // console.warn('User position contract is not deployed yet');
        return null;
      }
    },
    { refetchInterval: 3000 }
  );

  return {
    collateral: data ? +fromNano(data.collateral) : 0,
    debt: data ? +fromNano(data.debt) : 0,
    message: data
      ? {
          value: data.message.message,
          timestamp: Number(data.message.timestamp),
        }
      : null,
  };
};

export default useUserPositionContract;

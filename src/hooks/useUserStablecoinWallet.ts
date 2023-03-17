import { useQuery } from '@tanstack/react-query';
import { useAsyncInitialize } from './useAsyncInitialize';
import { StablecoinMaster } from '../contracts/StablecoinMaster';
import { UserStablecoinWallet } from '../contracts/UserStablecoinWallet';
import { useTonClient } from './useTonClient';
import { Address, OpenedContract, fromNano } from 'ton-core';

const useUserStablecoinWallet = (userAddress: string) => {
  const { client } = useTonClient();

  const stablecoinMasterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contractAddress = 'EQBB1pLrZ7joVC8OYGF4_b2O-33MVa2uemI0LFarD2MRrfN8';
    const contract = StablecoinMaster.fromAddress(
      Address.parse(contractAddress)
    );
    return client.open(contract) as OpenedContract<StablecoinMaster>;
  }, [client]);

  const { data: userStablecoinWalletContractAddress } = useQuery(
    ['stablecoinMaster'],
    async () => {
      if (!stablecoinMasterContract) return null;

      return stablecoinMasterContract.getGetWalletAddress(
        Address.parse(userAddress)
      );
    },
    { enabled: !!userAddress && !!stablecoinMasterContract }
  );

  const userStablecoinWalletContract = useAsyncInitialize(async () => {
    if (!client || !userStablecoinWalletContractAddress) return null;
    const contract = UserStablecoinWallet.fromAddress(
      userStablecoinWalletContractAddress
    );

    return client.open(contract) as OpenedContract<UserStablecoinWallet>;
  }, [client, userStablecoinWalletContractAddress]);

  const { data } = useQuery(
    ['userStablecoinWallet'],
    async () => {
      try {
        if (!userStablecoinWalletContract) return null;
        return await userStablecoinWalletContract.getGetBalance();
      } catch (e) {
        // console.warn('User position contract is not deployed yet');
        return null;
      }
    },
    { refetchInterval: 3000 }
  );

  return {
    stableBalance: data ? fromNano(data) : 0,
  };
};

export default useUserStablecoinWallet;

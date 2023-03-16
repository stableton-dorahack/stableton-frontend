import { useTonAddress } from '@tonconnect/ui-react';
import { Address } from 'ton-core';
import { fromNano } from '../utils';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';

const useBalance = () => {
  const { client } = useTonClient();
  const address = useTonAddress();

  return useAsyncInitialize(() => {
    if (!client) return new Promise((resolve) => resolve(null));
    return client
      ?.getBalance(Address.parse(address))
      .then((balance) => fromNano(balance));
  }, [client]) as number | null;
};

export default useBalance;

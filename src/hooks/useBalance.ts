import { useQuery } from '@tanstack/react-query';
import { useTonAddress } from '@tonconnect/ui-react';
import { Address } from 'ton-core';
import { fromNano } from '../utils';
import { useTonClient } from './useTonClient';

const useBalance = () => {
  const { client } = useTonClient();
  const address = useTonAddress();

  const { data } = useQuery(
    ['balance'],
    async () => {
      if (!client) return null;
      return await client.getBalance(Address.parse(address));
    },
    { refetchInterval: 3000 }
  );

  return data ? +fromNano(data) : 0;
};

export default useBalance;

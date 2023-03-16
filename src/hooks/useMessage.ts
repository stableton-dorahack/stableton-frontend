import { useEffect, useRef } from 'react';

import useUserPosition from './useUserPosition';

const useMessage = (toast: { success: (message: string) => void }) => {
  const { message } = useUserPosition();
  const timespampRef = useRef<number | null>(null);

  useEffect(() => {
    if (!message || timespampRef.current === message.timestamp) {
      return;
    }

    if (timespampRef.current === null) {
      timespampRef.current = message.timestamp;
      return;
    }

    toast.success(message.value);
    timespampRef.current = message.timestamp;
  }, [message]);
};

export default useMessage;

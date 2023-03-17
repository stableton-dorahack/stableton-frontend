import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import useUserPosition from './useUserPosition';

const useMessage = () => {
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

    toast.success(message.value, { duration: 5000 });
    timespampRef.current = message.timestamp;
  }, [message]);
};

export default useMessage;

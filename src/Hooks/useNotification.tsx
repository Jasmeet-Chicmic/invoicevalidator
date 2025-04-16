// hooks/useNotification.ts
import { toast, ToastOptions, TypeOptions } from 'react-toastify';
import { firstLetterUpperCase } from '../Shared/functions';

type NotifyOptions = {
  type?: TypeOptions; // "info" | "success" | "warning" | "error" | "default"
  options?: ToastOptions;
};

const useNotification = () => {
  const notify = (message: string, notifyOptions?: NotifyOptions) => {
    const { type = 'default', options } = notifyOptions || {};
    toast(firstLetterUpperCase(message), {
      type,
      ...options,
    });
  };

  return notify;
};

export default useNotification;

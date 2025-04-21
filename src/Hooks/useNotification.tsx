// hooks/useNotification.ts
import { toast, ToastOptions, TypeOptions } from 'react-toastify';
import { firstLetterUpperCase } from '../Shared/functions';
import { TOAST_CONFIG } from '../Shared/Constants';
import { STATUS } from '../Shared/enum';

type NotifyOptions = {
  type?: TypeOptions; // "info" | "success" | "warning" | "error" | "default"
  options?: ToastOptions;
};

const useNotification = () => {
  const notify = (message: string, notifyOptions?: NotifyOptions) => {
    const { type = STATUS.success, options } = notifyOptions || {};
    toast(firstLetterUpperCase(message), {
      type,
      ...options,
      autoClose: TOAST_CONFIG.TIME_TO_SHOW,
    });
  };

  return notify;
};

export default useNotification;

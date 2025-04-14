// hooks/useNotification.ts
import { useSnackbar, VariantType } from 'notistack';
import { firstLetterUpperCase } from '../Shared/functions';

type NotifyOptions = {
  variant?: VariantType; // "default" | "error" | "success" | "warning" | "info"
};

const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message: string, options?: NotifyOptions) => {
    
    enqueueSnackbar(firstLetterUpperCase(message), { variant: options?.variant || 'default' });
  };

  return notify;
};

export default useNotification;

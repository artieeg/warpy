import {ToastContext} from '@app/components';
import {useContext} from 'react';

export const useToast = () => {
  const toast = useContext(ToastContext);

  if (!toast) {
    throw new Error();
  }

  return toast;
};

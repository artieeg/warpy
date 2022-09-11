import {BaseSlideModalRefProps} from '@app/components';
import {useStore} from '@app/store';
import {Modal} from '@warpy/client';
import {useRef} from 'react';

export const useModalRef = (modal: Modal) => {
  const ref = useRef<BaseSlideModalRefProps>(null);

  useStore.subscribe(state => {
    if (state.modalCurrent === modal) {
      ref.current?.open();
    }
  });

  return ref;
};

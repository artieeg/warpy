import {useDispatcher, useStoreShallow} from '@app/store';
import {useCallback} from 'react';

export const useBotConfirmModalController = () => {
  const dispatch = useDispatcher();
  const [api, currentModal, confirmationId, bot] = useStoreShallow(state => [
    state.api,
    state.modalCurrent,
    state.modalBotConfirmId,
    state.modalBotConfirmData,
  ]);

  const visible = currentModal === 'bot-confirm';

  const onDecline = useCallback(() => {
    if (confirmationId) {
      api.botDev.cancel(confirmationId);
      dispatch(({modal}) => modal.close());
    }
  }, [confirmationId]);

  const onConfirm = useCallback(() => {
    if (confirmationId) {
      api.botDev.confirm(confirmationId);
      dispatch(({modal}) => modal.close());
    }
  }, [confirmationId]);

  return {
    visible,
    onConfirm,
    onDecline,
    bot,
  };
};

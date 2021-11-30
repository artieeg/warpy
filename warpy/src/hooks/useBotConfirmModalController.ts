import {useStore} from '@app/store';
import {useCallback, useMemo} from 'react';
import shallow from 'zustand/shallow';
import {useStreamParticipant} from './useStreamParticipant';

export const useBotConfirmModalController = () => {
  const [api, currentModal, confirmationId, bot, dispatchModalClose] = useStore(
    state => [
      state.api,
      state.modalCurrent,
      state.modalBotConfirmId,
      state.modalBotConfirmData,
      state.dispatchModalClose,
    ],
    shallow,
  );

  const visible = currentModal === 'bot-confirm';

  const onDecline = useCallback(() => {
    if (confirmationId) {
      api.botDev.cancel(confirmationId);
      dispatchModalClose();
    }
  }, [confirmationId]);

  const onConfirm = useCallback(() => {
    if (confirmationId) {
      api.botDev.confirm(confirmationId);
      dispatchModalClose();
    }
  }, [confirmationId]);

  return {
    visible,
    onConfirm,
    onDecline,
    bot,
  };
};

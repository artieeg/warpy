import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {useDispatcher, useStoreShallow} from '@app/store';
import {useModalRef} from '@app/hooks/useModalRef';

const useBotConfirmModalController = () => {
  const dispatch = useDispatcher();

  const ref = useModalRef('bot-confirm');

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
    ref,
  };
};

export const BotConfirmModal = () => {
  const {onConfirm, onDecline, bot, ref} = useBotConfirmModalController();

  return (
    <BaseSlideModal style={styles.modal} ref={ref}>
      {bot && (
        <View style={styles.wrapper}>
          <Text style={styles.title} weight="bold">
            confirm new bot
          </Text>
          <View style={styles.avatarAndUserInfo}>
            <Avatar size="large" user={{avatar: bot.avatar} as any} />
            <View style={styles.userInfo}>
              <Text weight="bold">{bot.name}</Text>
              <Text weight="bold" size="small">
                {bot.botname}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <SmallTextButton
              onPress={onConfirm}
              style={styles.confirmButton}
              title={'confirm'}
            />
            <SmallTextButton onPress={onDecline} color="red" title="cancel" />
          </View>
        </View>
      )}
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  modal: {
    minHeight: 300,
    height: 300,
    maxHeight: 300,
  },
  avatarAndUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    paddingLeft: 20,
  },
  actions: {
    marginVertical: 20,
    flexDirection: 'row',
  },
  confirmButton: {
    marginRight: 10,
  },
  title: {
    marginBottom: 20,
  },
});

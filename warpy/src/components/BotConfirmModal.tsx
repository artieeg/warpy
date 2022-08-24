import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {useBotConfirmModalController} from '@app/hooks/useBotConfirmModalController';

export const BotConfirmModal = () => {
  const {visible, onConfirm, onDecline, bot} = useBotConfirmModalController();

  if (!bot) {
    return null;
  }

  return (
    <BaseSlideModal style={styles.modal} visible={visible}>
      <View style={styles.wrapper}>
        <Text style={styles.title} weight="bold">
          confirm new bot
        </Text>
        <View style={styles.avatarAndUserInfo}>
          <Avatar size="large" user={{avatar: bot!.avatar} as any} />
          <View style={styles.userInfo}>
            <Text weight="bold">{bot!.name}</Text>
            <Text weight="bold" size="small">
              {bot?.botname}
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

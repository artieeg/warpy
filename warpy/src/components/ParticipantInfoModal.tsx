import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {useParticipantModalController} from '@app/hooks/useParticipantModalController';

export const ParticipantInfoModal = () => {
  const {participant, visible, isFollowing, onToggleFollow} =
    useParticipantModalController();

  return (
    <BaseSlideModal style={styles.modal} visible={visible}>
      {participant && (
        <View style={styles.wrapper}>
          <View style={styles.avatarAndUserInfo}>
            <Avatar size="large" user={participant} />
            <View style={styles.userInfo}>
              <Text weight="bold">{participant.username}</Text>
              <Text weight="bold" size="small">
                {participant?.first_name}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <SmallTextButton
              onPress={onToggleFollow}
              style={styles.followButton}
              title={isFollowing ? 'unfollow' : 'follow'}
            />
            <SmallTextButton color="important" title="report" />
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
  followButton: {
    marginRight: 10,
  },
});

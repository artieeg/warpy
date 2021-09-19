import {useStreamParticipant} from '@app/hooks';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {useStore} from '@app/store';

interface IParticipantInfoModal {
  user: string | null;
  visible: boolean;
  onHide: () => any;
}

export const ParticipantInfoModal = (props: IParticipantInfoModal) => {
  const {user, visible, onHide} = props;

  const api = useStore.use.api();

  const checkIsFollowing = useStore.use.has();
  const addNewFollowing = useStore.use.add();
  const removeFollowing = useStore.use.remove();

  const isFollowing = checkIsFollowing(user!);
  const participant = useStreamParticipant(user!);

  const userFullName = useMemo(
    () => `${participant?.first_name} ${participant?.last_name}`,
    [],
  );

  const onToggleFollow = async () => {
    if (!user) {
      return;
    }

    if (isFollowing) {
      await api.user.unfollow(user);

      removeFollowing(user);
    } else {
      await api.user.follow(user);

      addNewFollowing(user);
    }
  };

  const renderParticipantInfo = () => {
    if (!participant) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        <View style={styles.avatarAndUserInfo}>
          {<Avatar size="large" user={participant} />}
          <View style={styles.userInfo}>
            <Text weight="bold">{participant.username}</Text>
            <Text weight="bold" size="small">
              {userFullName}
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
    );
  };

  return (
    <BaseSlideModal style={styles.modal} visible={visible} onHide={onHide}>
      {renderParticipantInfo()}
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

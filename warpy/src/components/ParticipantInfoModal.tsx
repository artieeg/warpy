import {useAppUser, useStreamParticipant} from '@app/hooks';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {useFollowingStore} from '@app/stores';
import {useWebSocketContext} from './WebSocketContext';

interface IParticipantInfoModal {
  user: string | null;
  onHide: () => any;
}

export const ParticipantInfoModal = (props: IParticipantInfoModal) => {
  const {user, onHide} = props;

  const api = useWebSocketContext();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setVisible(true);
      }, 300);
    } else {
      setVisible(false);
    }
  }, [user]);

  const followingStore = useFollowingStore();

  const isFollowing = followingStore.has(user!);

  const participant = useStreamParticipant(user!);

  const userFullName = `${participant?.first_name} ${participant?.last_name}`;

  const onToggleFollow = async () => {
    if (!user) {
      return;
    }

    if (useFollowingStore.getState().has(user)) {
      await api.user.unfollow(user);

      followingStore.remove(user);
    } else {
      await api.user.follow(user);

      followingStore.add(user);
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

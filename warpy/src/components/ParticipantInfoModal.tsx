import {useStreamParticipant} from '@app/hooks';
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

interface IParticipantInfoModal {
  user: string | null;
  visible: boolean;
  onHide: () => any;
}

export const ParticipantInfoModal = (props: IParticipantInfoModal) => {
  const {user, visible, onHide} = props;

  const [following, dispatchFollowingAdd, dispatchFollowingRemove] = useStore(
    state => [
      state.following,
      state.dispatchFollowingAdd,
      state.dispatchFollowingRemove,
    ],
    shallow,
  );

  const isFollowing = useMemo(
    () => following.includes(user!),
    [following, user],
  );
  const participant = useStreamParticipant(user!);

  const userFullName = useMemo(
    () => `${participant?.first_name} ${participant?.last_name}`,
    [participant?.first_name, participant?.last_name],
  );

  const onToggleFollow = async () => {
    if (!user) {
      return;
    }

    if (isFollowing) {
      dispatchFollowingRemove(user);
    } else {
      dispatchFollowingAdd(user);
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

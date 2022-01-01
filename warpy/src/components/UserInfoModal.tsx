import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {UserGeneralInfo} from './UserGeneralInfo';
import {UserAwardsPreview} from './UserAwardsPreview';
import {useStore, useStoreShallow} from '@app/store';
import {useModalNavigation} from '@app/hooks';

export const useParticipantModalController = () => {
  const [visible, modalSelectedUser, following] = useStoreShallow(state => [
    state.modalCurrent === 'participant-info',
    state.modalSelectedUser,
    state.following,
  ]);

  const navigation = useModalNavigation();
  const participant = modalSelectedUser!;

  //const participant =
  //  useStreamParticipant(modalSelectedUser?.id) || modalSelectedUser;

  const onOpenProfile = useCallback(() => {
    useStore.getState().dispatchModalClose();
    navigation.navigate('User', {id: modalSelectedUser});
  }, [modalSelectedUser]);

  const isFollowing = useMemo(
    () => following.includes(modalSelectedUser?.id!),
    [following, modalSelectedUser],
  );

  const onStartRoomTogether = useCallback(async () => {
    const startRoomTogetherTimeout = setTimeout(() => {
      useStore.getState().dispatchPendingInvite(participant.id);
      useStore.getState().dispatchSendPendingInvites();
    }, 400);

    navigation.navigate('NewStream', {startRoomTogetherTimeout});
  }, [navigation, participant]);

  const onToggleFollow = useCallback(async () => {
    if (!participant) {
      return;
    }

    if (isFollowing) {
      useStore.getState().dispatchFollowingRemove(participant.id);
    } else {
      useStore.getState().dispatchFollowingAdd(participant.id);
    }
  }, [participant, isFollowing]);

  return {
    visible,
    participant,
    isFollowing,
    onToggleFollow,
    onOpenProfile,
    onStartRoomTogether,
  };
};

export const UserInfoModal = () => {
  const {
    participant,
    onOpenProfile,
    visible,
    onStartRoomTogether,
    isFollowing,
    onToggleFollow,
  } = useParticipantModalController();

  return (
    <BaseSlideModal style={styles.modal} visible={visible}>
      {participant && (
        <View style={styles.wrapper}>
          <UserGeneralInfo
            indicatorProps={{borderColor: '#202020'}}
            style={styles.generalInfo}
            user={participant}
          />
          <SmallTextButton
            onPress={onStartRoomTogether}
            title="start a stream together"
          />
          <UserAwardsPreview user={participant.id} />
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
  actionsRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  more: {
    height: 42,
    width: 42,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  generalInfo: {
    marginBottom: 20,
  },
});

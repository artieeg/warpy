import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {UserGeneralInfo} from './UserGeneralInfo';
import {UserAwardsPreview} from './UserAwardsPreview';
import {useStore, useStoreShallow} from '@app/store';
import {useModalNavigation, useUserData} from '@app/hooks';
import {UserActions} from './UserActions';

export const useParticipantModalController = () => {
  const [visible, modalSelectedUser, following] = useStoreShallow(state => [
    state.modalCurrent === 'participant-info',
    state.modalSelectedUser,
    state.following,
  ]);

  const navigation = useModalNavigation();
  const participant = modalSelectedUser!;

  const data = useUserData(participant?.id);

  const onStartRoomTogether = useCallback(async () => {
    const startRoomTogetherTimeout = setTimeout(() => {
      useStore.getState().dispatchPendingInvite(participant.id);
      useStore.getState().dispatchSendPendingInvites();
    }, 400);

    navigation.navigate('NewStream', {startRoomTogetherTimeout});
  }, [navigation, participant]);

  return {
    visible,
    stream: data?.stream,
    participant,
    onStartRoomTogether,
  };
};

export const UserInfoModal = () => {
  const {participant, visible, onStartRoomTogether, stream} =
    useParticipantModalController();

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
          <UserActions id={participant.id} />
        </View>
      )}
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  modal: {},
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
    marginBottom: 30,
  },
});

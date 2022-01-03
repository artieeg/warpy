import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {UserGeneralInfo} from './UserGeneralInfo';
import {UserAwardsPreview} from './UserAwardsPreview';
import {useStore, useStoreShallow} from '@app/store';
import {useModalNavigation, useUserData} from '@app/hooks';
import {colors} from '../../colors';
import {SmallIconButton} from './SmallIconButton';

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

  const onOpenProfile = useCallback(() => {
    useStore.getState().dispatchModalClose();
    navigation.navigate('User', {id: participant.id});
  }, [participant.id]);

  const isFollowing = useMemo(
    () => following.includes(participant.id),
    [following, participant.id],
  );

  const onToggleFollow = useCallback(async () => {
    if (isFollowing) {
      useStore.getState().dispatchFollowingRemove(participant.id);
    } else {
      useStore.getState().dispatchFollowingAdd(participant.id);
    }
  }, [participant.id, isFollowing]);

  const onReport = useCallback(() => {
    useStore.getState().dispatchModalOpen('reports');
  }, []);

  const onBlock = useCallback(() => {
    throw new Error('Not implemented yet');
  }, []);

  const onChat = useCallback(() => {
    throw new Error('Not implemented yet');
  }, []);

  return {
    isFollowing,
    onToggleFollow,
    onOpenProfile,
    onReport,
    onBlock,
    onChat,
    visible,
    stream: data?.stream,
    participant,
    onStartRoomTogether,
  };
};

export const UserInfoModal = () => {
  const {participant, visible, onStartRoomTogether} =
    useParticipantModalController();

  return (
    <BaseSlideModal style={styles.modal} visible={visible}>
      {participant && (
        <View style={styles.wrapper}>
          <UserGeneralInfo
            indicatorProps={{borderColor: colors.cod_gray}}
            style={styles.generalInfo}
            user={participant}
          />

          <UserAwardsPreview user={participant.id} />

          <View style={styles.actions}>
            <View style={styles.actionsRow}>
              <SmallTextButton
                style={styles.rowTextButton}
                color="blue"
                onPress={onStartRoomTogether}
                title="follow"
              />

              <SmallTextButton
                style={styles.rowTextButton}
                color="green"
                onPress={onStartRoomTogether}
                title="chat"
              />
              <SmallIconButton
                style={styles.rowButtonFinal}
                name="flag"
                color="red"
              />
            </View>

            <SmallTextButton
              color="yellow"
              onPress={onStartRoomTogether}
              title="start a stream together"
            />
          </View>

          <SmallTextButton
            color="mine_shaft"
            textColor="white"
            onPress={onStartRoomTogether}
            title="see user details"
          />
        </View>
      )}
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  actions: {
    marginBottom: 30,
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  modal: {
    height: '80%',
  },
  actionsRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  rowTextButton: {
    flex: 1,
    marginRight: 10,
  },
  rowButtonFinal: {
    marginRight: 0,
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

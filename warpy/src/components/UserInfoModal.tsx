import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {SmallTextButton} from './SmallTextButton';
import {UserGeneralInfo} from './UserGeneralInfo';
import {Text} from './Text';
import {useDispatcher, useStoreShallow} from '@app/store';
import {useModalNavigation, useUserData} from '@app/hooks';
import {colors} from '../../colors';
import {SmallIconButton} from './SmallIconButton';
import {useModalRef} from '@app/hooks/useModalRef';

export const useParticipantModalController = () => {
  const dispatch = useDispatcher();

  const ref = useModalRef('participant-info');

  const [modalSelectedUser, following] = useStoreShallow(state => [
    state.modalSelectedUser,
    state.modalCurrent,
    state.following,
  ]);

  const navigation = useModalNavigation();
  const userId = modalSelectedUser?.id;

  const data = useUserData(userId);

  const onStartRoomTogether = useCallback(async () => {
    if (!userId) return;

    const startRoomTogetherTimeout = setTimeout(() => {
      dispatch(({invite}) => {
        invite.addPendingInvite(userId);
        invite.sendPendingInvites();
      });
    }, 400);

    navigation.navigate('NewStream', {startRoomTogetherTimeout});

    dispatch(({modal}) => modal.close());
  }, [navigation, userId]);

  const onOpenProfile = useCallback(() => {
    if (!userId) return;

    dispatch(({modal}) => modal.close());
    navigation.navigate('User', {id: userId});
  }, [userId]);

  const isFollowing = useMemo(
    () => (userId ? following?.includes(userId) : false),
    [following, userId],
  );

  const onToggleFollow = useCallback(async () => {
    if (!userId) return;

    if (isFollowing) {
      dispatch(({user}) => user.unfollow(userId));
    } else {
      dispatch(({user}) => user.follow(userId));
    }
  }, [userId, isFollowing]);

  const onReport = useCallback(() => {
    dispatch(({modal}) => {
      ref.current?.close();
      modal.open('reports');
    });
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
    ref,
    stream: data?.stream,
    participant: modalSelectedUser,
    onStartRoomTogether,
  };
};

export const UserInfoModal = () => {
  const {
    participant,
    onToggleFollow,
    isFollowing,
    ref,
    onReport,
    onStartRoomTogether,
    stream,
    onOpenProfile,
  } = useParticipantModalController();

  const dispatch = useDispatcher();

  return (
    <BaseSlideModal
      onClose={() => dispatch(({modal}) => modal.close())}
      style={styles.modal}
      ref={ref}
    >
      {!participant && (
        <View style={styles.loadingIndicatorContainer}>
          <ActivityIndicator size="small" color={colors.green} />
        </View>
      )}

      {participant && (
        <View style={styles.wrapper}>
          <UserGeneralInfo
            indicatorProps={{borderColor: colors.cod_gray}}
            style={styles.generalInfo}
            user={participant}
          />

          {/**
          <UserAwardsPreview user={participant.id} />
          */}

          <View style={styles.bioTextHolder}>
            <Text size="xsmall" color="boulder">
              bio
            </Text>

            <Text
              size="small"
              numberOfLines={4}
              color={!!participant.bio ? 'gray' : 'boulder'}
              ellipsizeMode="tail"
            >
              {!!participant.bio && participant.bio}
              {!participant.bio && `${participant.username} has no bio yet`}
            </Text>
          </View>

          {stream && (
            <TouchableOpacity style={styles.inTheRoomWrapper}>
              <View style={styles.roomTextInfo}>
                <Text size="xsmall" color="boulder">
                  in the room
                </Text>
                <Text size="small" numberOfLines={1} ellipsizeMode="tail">
                  {stream.title}
                </Text>
              </View>
              <SmallIconButton
                name="chevron-right"
                size={20}
                background="mine_shaft"
                color="white"
              />
            </TouchableOpacity>
          )}

          <View style={styles.actions}>
            <View style={styles.actionsRow}>
              <SmallTextButton
                style={styles.rowTextButton}
                color="blue"
                onPress={onToggleFollow}
                title={isFollowing ? 'unfollow' : 'follow'}
              />

              <SmallTextButton
                color="mine_shaft"
                textColor="white"
                title="details"
                onPress={onOpenProfile}
                style={styles.rowTextButton}
              />
              <SmallIconButton
                style={styles.rowButtonFinal}
                onPress={onReport}
                name="flag-1"
                size={15}
                background="red"
              />
            </View>

            <SmallTextButton
              color="yellow"
              onPress={onStartRoomTogether}
              title="start a stream together"
            />
          </View>
        </View>
      )}
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  actions: {
    //marginBottom: 30,
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  modal: {
    paddingBottom: 30,
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
  inTheRoomWrapper: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bioTextHolder: {
    paddingRight: 30,
    flex: 1,
    marginBottom: 30,
  },
  roomTextInfo: {
    paddingRight: 30,
    flex: 1,
  },
  loadingIndicatorContainer: {
    height: Dimensions.get('window').height * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

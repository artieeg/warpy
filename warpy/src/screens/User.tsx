import {ScreenHeader, Text} from '@app/components';
import {IconButton} from '@app/components/IconButton';
import {SmallTextButton} from '@app/components/SmallTextButton';
import {UserAwardsPreview} from '@app/components/UserAwardsPreview';
import {UserGeneralInfo} from '@app/components/UserGeneralInfo';
import {useRouteParamsUnsafe, useUserData} from '@app/hooks';
import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import FadeInOut from 'react-native-fade-in-out';
import shallow from 'zustand/shallow';

export const useUserScreenController = () => {
  const [api, following] = useStore(
    store => [store.api, store.following],
    shallow,
  );

  const {id} = useRouteParamsUnsafe();
  const data = useUserData(id);

  const navigation = useNavigation();

  const isFollowing = useMemo(() => following.includes(id), [following, id]);

  const onToggleFollow = useCallback(async () => {
    if (!id) {
      return;
    }

    if (isFollowing) {
      useStore.getState().dispatchFollowingRemove(id);
    } else {
      useStore.getState().dispatchFollowingAdd(id);
    }
  }, [id, isFollowing]);

  const onStartRoomTogether = useCallback(async () => {
    const startRoomTogetherTimeout = setTimeout(() => {
      useStore.getState().dispatchPendingInvite(id);
      useStore.getState().dispatchSendPendingInvites();
    }, 400);

    navigation.navigate('NewStream', {startRoomTogetherTimeout});
  }, [navigation]);

  return {
    user: data?.user,
    stream: data?.stream,
    onToggleFollow,
    isFollowing,
    onStartRoomTogether,
  };
};

export const User = () => {
  const {user, stream, onToggleFollow, onStartRoomTogether, isFollowing} =
    useUserScreenController();

  return (
    <ScrollView style={styles.wrapper}>
      <ScreenHeader />
      <FadeInOut
        visible={!!user}
        duration={200}
        useNativeDriver
        style={styles.padding}>
        {!!user && <UserGeneralInfo user={user} />}
        <View style={styles.buttons}>
          <View style={[styles.actionsRow, styles.actionRowSeparator]}>
            <SmallTextButton
              onPress={onToggleFollow}
              style={[styles.actionMargin, {flex: 1.5}]}
              title={isFollowing ? 'unfollow' : 'follow'}
            />
            <SmallTextButton
              style={[styles.actionMargin, {flex: 1}]}
              color="important"
              title="report"
            />
            <IconButton
              color="#fff"
              style={styles.more}
              name="dots-horizontal"
              size={20}
            />
          </View>
          <View style={styles.actionsRow}>
            <SmallTextButton
              onPress={onStartRoomTogether}
              style={styles.streamTogether}
              title="start a room together"
            />
          </View>
        </View>

        {user?.id && (
          <>
            <Text size="small" color="info">
              recent awards
            </Text>
            <UserAwardsPreview user={user.id} />
          </>
        )}

        {stream && (
          <>
            <Text size="small" color="info">
              in the room
            </Text>
            <Text>{stream.title}</Text>
          </>
        )}
      </FadeInOut>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  actionsRow: {
    flexDirection: 'row',
  },
  actionRowSeparator: {
    marginBottom: 10,
  },
  streamTogether: {
    flex: 1,
  },
  more: {
    height: 42,
    width: 42,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  actionMargin: {
    marginRight: 10,
  },
  padding: {
    paddingHorizontal: 20,
  },
  buttons: {
    marginVertical: 40,
  },
});

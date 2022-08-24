import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {User, UserList} from '@warpy/lib';
import {UserGeneralInfo} from './UserGeneralInfo';
import {SmallTextButton} from './SmallTextButton';
import {useDispatcher, useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';

interface BaseUserListItemProps {
  user: User;
  list: UserList;
}

interface ActionProps {
  user: User;
}

const FollowingItemAction = ({user: {id}}: ActionProps) => {
  const dispatch = useDispatcher();

  const [isFollowing] = useStore(state => [
    !!state.list_following.list.find(u => u.id === id),
  ]);

  return (
    <SmallTextButton
      title={isFollowing ? 'unfollow' : 'follow'}
      onPress={() => {
        if (!isFollowing) {
          dispatch(({user}) => user.follow(id));
        } else {
          dispatch(({user}) => user.unfollow(id));
        }
      }}
    />
  );
};

const BlockItemAction = ({user}: ActionProps) => {
  const [isBlocked, setBlocked] = useState(true);
  const api = useStore(state => state.api);

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (isBlocked) {
      api.user.block(user.id);
    } else {
      api.user.unblock(user.id);
    }
  }, [isBlocked]);

  return (
    <SmallTextButton
      title={isBlocked ? 'unblock' : 'block'}
      onPress={() => setBlocked(prev => !prev)}
    />
  );
};

export const UserListItem = ({user, list}: BaseUserListItemProps) => {
  const navigation = useNavigation();

  const onOpenUser = useCallback(() => {
    navigation.navigate('User', {id: user.id});
  }, [navigation, user]);

  return (
    <TouchableOpacity onPress={onOpenUser} style={styles.wrapper}>
      <UserGeneralInfo user={user} size="large" />
      {(list === 'followers' || list === 'following') && (
        <FollowingItemAction user={user} />
      )}

      {list === 'blocked' && <BlockItemAction user={user} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

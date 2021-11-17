import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IUser, UserList} from '@warpy/lib';
import {UserGeneralInfo} from './UserGeneralInfo';
import {SmallTextButton} from './SmallTextButton';
import {useStore} from '@app/store';

interface BaseUserListItemProps {
  user: IUser;
  list: UserList;
}

interface ActionProps {
  user: IUser;
}

const FollowingItemAction = ({user}: ActionProps) => {
  const [isFollowing, dispatchFollowingAdd, dispatchFollowingRemove] = useStore(
    state => [
      state.following.includes(user.id),
      state.dispatchFollowingAdd,
      state.dispatchFollowingRemove,
    ],
  );

  return (
    <SmallTextButton
      title={isFollowing ? 'unfollow' : 'follow'}
      onPress={() => {
        if (!isFollowing) {
          dispatchFollowingAdd(user.id);
        } else {
          dispatchFollowingRemove(user.id);
        }
      }}
    />
  );
};

export const UserListItem = ({user, list}: BaseUserListItemProps) => {
  return (
    <View style={styles.wrapper}>
      <UserGeneralInfo user={user} avatar={{size: 'large'}} />
      {(list === 'followers' || list === 'following') && (
        <FollowingItemAction user={user} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

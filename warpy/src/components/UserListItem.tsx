import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IUser} from '@warpy/lib';
import {Avatar} from './Avatar';
import {UserGeneralInfo} from './UserGeneralInfo';

interface UserListItemProps {
  user: IUser;
  action: any;
}

export const UserListItem = ({user, action}: UserListItemProps) => {
  return (
    <View style={styles.wrapper}>
      <UserGeneralInfo user={user} avatar={{size: 'medium'}} />
      {action}
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

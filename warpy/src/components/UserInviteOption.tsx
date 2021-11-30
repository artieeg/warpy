import React, {useEffect, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {IUser} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';
import {Checkbox} from './Checkbox';
import {useStoreShallow} from '@warpy/store';

interface IUserInviteProps {
  user: IUser;
}

export const UserInviteOption = ({user}: IUserInviteProps) => {
  const [invited, setInvited] = useState(false);

  const [dispatchPendingInvite, dispatchCancelInvite] = useStoreShallow(
    state => [state.dispatchPendingInvite, state.dispatchCancelInvite],
  );

  useEffect(() => {
    if (invited) {
      dispatchPendingInvite(user.id);
    } else {
      dispatchCancelInvite(user.id);
    }
  }, [invited, user.id]);

  const {width} = useWindowDimensions();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.user, {width: width - 160}]}>
        <Avatar user={user} />
        <View style={[styles.info]}>
          <Text size="small" weight="bold">
            {user.first_name}
          </Text>
          <Text color="info" weight="bold" size="xsmall">
            {user.username}
          </Text>
        </View>
      </View>
      <Checkbox visible={invited} onToggle={() => setInvited(prev => !prev)} />
    </View>
  );
};

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    marginLeft: 20,
  },
});

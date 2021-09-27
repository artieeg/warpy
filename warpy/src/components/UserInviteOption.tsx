import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {IUser} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';
import {Checkbox} from './Checkbox';
import {useStore} from '@app/store';

interface IUserInviteProps {
  user: IUser;
}

export const UserInviteOption = ({user}: IUserInviteProps) => {
  const [invited, setInvited] = useState(false);

  const api = useStore.use.api();
  const stream = useStore.use.stream();

  const onInviteUser = useCallback(async () => {
    if (stream) {
      const {invite} = await api.stream.invite(user.id, stream);
      console.log('invite', invite);
    }
  }, [user.id]);

  useEffect(() => {
    if (invited) {
      onInviteUser();
    }
  }, [invited]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.user}>
        <Avatar user={user} />
        <View style={styles.info}>
          <Text weight="bold">{user.username}</Text>
          <Text
            weight="bold"
            size="small">{`${user.first_name} ${user.last_name}`}</Text>
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

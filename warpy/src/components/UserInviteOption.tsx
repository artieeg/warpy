import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
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

  const [invite, setInvite] = useState<string>();

  const onInviteUser = useCallback(async () => {
    if (stream) {
      const {invite} = await api.stream.invite(user.id, stream);
      setInvite(invite?.id);
    }
  }, [user.id]);

  const onCancelInvite = useCallback(async () => {
    if (invite) {
      console.log('cancelling invite', invite);
      await api.stream.cancelInvite(invite);
    }
  }, [user.id, invite]);

  useEffect(() => {
    if (invited) {
      onInviteUser();
    } else {
      onCancelInvite();
    }
  }, [invited]);

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

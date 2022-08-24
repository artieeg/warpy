import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {User} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';
import {Checkbox} from './Checkbox';
import {useDispatcher, useStore} from '@app/store';

interface IUserInviteProps {
  user: User;
}

const useUserInviteOptionController = (user: User) => {
  const sentInvites = useStore(store => store.sentInvites);
  const dispatch = useDispatcher();

  const isAlreadyInvited = React.useMemo(() => {
    const invites = Object.values(sentInvites);

    return !!invites.find(invite => invite.invitee.id === user.id);
  }, [sentInvites, user]);

  const [invited, setInvited] = useState(isAlreadyInvited);

  useEffect(() => {
    if (invited) {
      dispatch(({invite}) => invite.addPendingInvite(user.id));
    } else {
      dispatch(({invite}) => invite.cancelInvite(user.id));
    }
  }, [invited, user.id]);

  const onInviteToggle = useCallback(() => {
    if (!isAlreadyInvited) {
      setInvited(prev => !prev);
    }
  }, [isAlreadyInvited]);

  return {invited, onInviteToggle};
};

export const UserInviteOption = ({user}: IUserInviteProps) => {
  const {invited, onInviteToggle} = useUserInviteOptionController(user);
  const {width} = useWindowDimensions();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.user, {width: width - 160}]}>
        <Avatar user={user} />
        <View style={[styles.info]}>
          <Text size="small" weight="bold">
            {user.first_name}
          </Text>
          <Text color="boulder" weight="bold" size="xsmall">
            {user.username}
          </Text>
        </View>
      </View>
      <Checkbox visible={invited} onToggle={onInviteToggle} />
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

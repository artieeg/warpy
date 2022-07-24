import React, {useMemo} from 'react';
import {View, ViewProps} from 'react-native';
import {useStore} from '@app/store';
import {InvitedUser} from './InvitedUser';
import {InviteStates, User} from '@warpy/lib';

export const PendingInvites = (props: ViewProps) => {
  const sentInvites = useStore(state => state.sentInvites);

  const invites: {user: User; state: InviteStates}[] = useMemo(() => {
    console.log('invite', Object.values(sentInvites));

    return Object.values(sentInvites).map(invite => ({
      user: invite.invitee,
      state: invite.state,
    }));
  }, [sentInvites]);

  return (
    <View {...props}>
      {invites.map(invite => (
        <InvitedUser {...invite} />
      ))}
    </View>
  );
};

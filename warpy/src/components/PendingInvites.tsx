import React, {useMemo} from 'react';
import {View, ViewProps} from 'react-native';
import {useStore} from '@app/store';
import {InvitedUser} from './InvitedUser';
import {InviteStates, IUser} from '@warpy/lib';

export const PendingInvites = (props: ViewProps) => {
  const sentInvites = useStore.use.sentInvites();

  const invites: {user: IUser; state: InviteStates}[] = useMemo(
    () =>
      Object.values(sentInvites).map(invite => ({
        user: invite.invitee,
        state: invite.state,
      })),
    [sentInvites],
  );

  return (
    <View {...props}>
      {invites.map(invite => (
        <InvitedUser {...invite} />
      ))}
    </View>
  );
};

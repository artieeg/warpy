import React, {useMemo} from 'react';
import {View, ViewProps} from 'react-native';
import {useStore} from '@warpy/store';
import {InvitedUser} from './InvitedUser';
import {IInvite, InviteStates, IUser} from '@warpy/lib';

const getState = (invite: IInvite) => {
  return invite.accepted
    ? 'accepted'
    : invite.declined
    ? 'declined'
    : 'unknown';
};

export const PendingInvites = (props: ViewProps) => {
  const sentInvites = useStore.use.sentInvites();

  const invites: {user: IUser; state: InviteStates}[] = useMemo(
    () =>
      Object.values(sentInvites).map(invite => ({
        user: invite.invitee,
        state: getState(invite),
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

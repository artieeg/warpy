import React from 'react';
import {View, StyleSheet} from 'react-native';
import {User} from '@warpy/lib';
import {Avatar} from './Avatar';

interface IInvitedUserProps {
  user: User;
  state: 'accepted' | 'declined' | 'unknown';
}

export const InvitedUser = ({user, state}: IInvitedUserProps) => {
  return (
    <View>
      <Avatar user={user} />
      <View style={[styles.indicator, styles[state]]} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: 18,
    height: 18,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  accepted: {
    backgroundColor: '#BDF971',
  },
  unknown: {
    backgroundColor: '#F9F871',
  },
  declined: {
    backgroundColor: '#F97971',
  },
});

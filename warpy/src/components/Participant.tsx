import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {Participant} from '@app/models';

interface IParticipantProps {
  data: Participant;
}

export const ParticipantDisplay = (props: IParticipantProps) => {
  const {data} = props;

  const name = `${data.last_name} ${data.first_name}`;

  return (
    <View style={styles.wrapper}>
      <Avatar user={data} style={styles.avatar} />
      <View>
        <Text weight="bold">{name}</Text>
        <Text size="small">Test bio</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
});

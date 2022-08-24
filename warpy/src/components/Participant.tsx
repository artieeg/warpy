import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from './Text';
import {Avatar} from './Avatar';
import {Participant} from '@warpy/lib';
import {useStoreShallow} from '@app/store';

interface IParticipantProps {
  data: Participant;
}

export const ParticipantDisplay = (props: IParticipantProps) => {
  const {data} = props;

  const [isAppUser] = useStoreShallow(store => [store.user?.id === data.id]);

  const name = `${data.first_name}`;

  return (
    <View style={styles.wrapper}>
      <Avatar user={data} style={styles.avatar} />
      <Text numberOfLines={1} style={styles.name} size="xsmall" weight="bold">
        {isAppUser ? 'you' : name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {},
  name: {
    marginTop: 6,
  },
});

import React, {useMemo} from 'react';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {IParticipant} from '@warpy/lib';

interface IStreamerInfoProps {
  data: IParticipant;
}

export const StreamerInfo = React.memo((props: IStreamerInfoProps) => {
  const {data} = props;

  const [name, username] = useMemo(() => [data.first_name, data.username], []);

  return (
    <View style={styles.wrapper}>
      <Avatar user={data} />
      <View style={styles.text}>
        <Text weight="bold" size="small">
          {name}
        </Text>
        <Text weight="bold" color="boulder" ellipsizeMode="tail" size="small">
          {username}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  text: {
    marginLeft: 10,
  },
});

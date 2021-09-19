import React, {useMemo} from 'react';
import {Participant} from '@app/models';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';

interface IStreamerInfoProps {
  data: Participant;
}

export const StreamerInfo = (props: IStreamerInfoProps) => {
  const {data} = props;

  const name = useMemo(() => `${data.first_name} ${data.last_name}`, []);
  return (
    <View style={styles.wrapper}>
      <Avatar user={data} />
      <View style={styles.text}>
        <Text weight="bold" size="small">
          {name}
        </Text>
        <Text size="small">Some test bio to fill the space</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  text: {
    marginLeft: 10,
  },
});

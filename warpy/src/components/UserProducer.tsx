import React, {useCallback} from 'react';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {SmallTextButton} from './SmallTextButton';
import {useStore} from '@app/store';
import {IParticipant} from '@warpy/lib';
import {IconButton} from './IconButton';

interface IRaisedHandInfo {
  data: IParticipant;
}

export const UserProducer = (props: IRaisedHandInfo) => {
  const {data} = props;
  const {role} = data;

  const api = useStore.use.api();

  const name = `${data.first_name} ${data.last_name}`;
  return (
    <View style={styles.wrapper}>
      <Avatar user={data} />
      <View style={styles.text}>
        <Text weight="bold" style={styles.name} size="small">
          {name}
        </Text>
        <View style={styles.producerActionWrapper}>
          <IconButton
            size={20}
            name={role !== 'viewer' ? 'mic-on' : 'mic-off'}
            color={role !== 'viewer' ? '#000' : '#fff'}
            style={[
              styles.producerAction,
              role !== 'viewer' && styles.producerActionEnabled,
            ]}
          />
          <IconButton
            size={20}
            name={role !== 'streamer' ? 'video' : 'video-off'}
            color={role !== 'streamer' ? '#fff' : '#000'}
            style={[
              styles.producerAction,
              role === 'streamer' && styles.producerActionEnabled,
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    marginBottom: 10,
  },
  text: {
    marginLeft: 10,
  },
  producerAction: {
    width: 35,
    height: 35,
    marginBottom: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  producerActionEnabled: {
    backgroundColor: '#F9F871',
  },
  producerActionWrapper: {
    flexDirection: 'row',
  },
});

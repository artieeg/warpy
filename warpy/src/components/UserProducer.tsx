import React from 'react';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {useStoreShallow} from '@app/store';
import {Participant} from '@warpy/lib';
import {IconButton} from './IconButton';

interface IRaisedHandInfo {
  data: Participant;
}

export const UserProducer = (props: IRaisedHandInfo) => {
  const {data} = props;
  const {id, role} = data;
  const name = `${data.first_name}`;

  const [api, isStreamOwner, isAppUser] = useStoreShallow(store => [
    store.api,
    store.currentStreamHost === store.user?.id,
    store.user?.id === id,
  ]);

  return (
    <View style={styles.wrapper}>
      <Avatar user={data} />
      <View style={styles.text}>
        <Text weight="bold" style={styles.name} size="small">
          {name}
        </Text>
        {isAppUser && (
          <Text weight="bold" color="boulder" size="xsmall">
            you
          </Text>
        )}

        {isStreamOwner && !isAppUser && (
          <View style={styles.producerActionWrapper}>
            <IconButton
              onPress={async () => {
                api.stream.setRole(
                  id,
                  role === 'viewer' ? 'speaker' : 'viewer',
                );
              }}
              size={20}
              name={role !== 'viewer' ? 'mic-on' : 'mic-off'}
              color={role !== 'viewer' ? '#000' : '#fff'}
              style={[
                styles.producerAction,
                role !== 'viewer' && styles.producerActionEnabled,
              ]}
            />
            <IconButton
              onPress={async () => {
                api.stream.setRole(
                  id,
                  role === 'streamer' ? 'speaker' : 'streamer',
                );
              }}
              size={20}
              name={role !== 'streamer' ? 'camera' : 'camera'}
              color={role !== 'streamer' ? '#fff' : '#000'}
              style={[
                styles.producerAction,
                role === 'streamer' && styles.producerActionEnabled,
              ]}
            />
          </View>
        )}
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
  name: {},
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
    marginTop: 10,
    flexDirection: 'row',
  },
});

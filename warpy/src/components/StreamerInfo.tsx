import React from 'react';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {Participant} from '@warpy/lib';
import {SmallTextButton} from './SmallTextButton';
import {useDispatcher, useStore, useStoreShallow} from '@app/store';

interface StreamerInfoProps {
  data: Participant;
}

export const StreamerInfo: React.FC<StreamerInfoProps> = props => {
  const {data} = props;

  const [name, username] = [data.first_name, data.username];

  const dispatch = useDispatcher();
  const [isStreamOwner, canReassign] = useStoreShallow(state => [
    state.user?.id === state.currentStreamHost,
    Object.keys(state.streamers).length > 1,
  ]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Avatar user={data} />
        <View style={styles.text}>
          <Text weight="bold" size="small">
            {name}
          </Text>
          <Text weight="bold" color="boulder" ellipsizeMode="tail" size="small">
            {isStreamOwner ? 'you' : username}
          </Text>
        </View>
      </View>

      {isStreamOwner && canReassign && (
        <View>
          <SmallTextButton
            onPress={() => {
              dispatch(({modal}) => modal.open('host-reassign'));
            }}
            title="reassign"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    marginLeft: 10,
  },
});

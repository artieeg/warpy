import React, {useCallback} from 'react';
import {Participant} from '@app/models';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {SmallTextButton} from './SmallTextButton';
import {useWebSocketContext} from './WebSocketContext';

interface IRaisedHandInfo {
  data: Participant;
}

export const UserWithRaisedHand = (props: IRaisedHandInfo) => {
  const {data} = props;

  const ws = useWebSocketContext();

  const onAllow = useCallback(() => {
    ws.sendAllowSpeaker(data.id);
  }, [ws, data.id]);

  const name = `${data.first_name} ${data.last_name}`;
  return (
    <View style={styles.wrapper}>
      <Avatar user={data} />
      <View style={styles.text}>
        <Text weight="bold" style={styles.name} size="small">
          {name}
        </Text>
        <SmallTextButton onPress={onAllow} title="Accept" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginBottom: 10,
  },
  text: {
    marginLeft: 10,
  },
});

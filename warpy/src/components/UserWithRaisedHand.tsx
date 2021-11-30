import React, {useCallback} from 'react';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {SmallTextButton} from './SmallTextButton';
import {useStore} from '@app/store';
import {IParticipant} from '@warpy/lib';

interface IRaisedHandInfo {
  data: IParticipant;
}

export const UserWithRaisedHand = (props: IRaisedHandInfo) => {
  const {data} = props;

  const api = useStore.use.api();

  const onAllow = useCallback(() => {
    api.stream.setRole(data.id, 'speaker');
  }, [api, data.id]);

  const name = `${data.first_name}`;
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

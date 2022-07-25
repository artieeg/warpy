import React, {useCallback} from 'react';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {SmallTextButton} from './SmallTextButton';
import {useStoreShallow} from '@app/store';
import {Participant} from '@warpy/lib';

interface IRaisedHandInfo {
  data: Participant;
}

export const UserWithRaisedHand = (props: IRaisedHandInfo) => {
  const {data} = props;

  const [api, isStreamOwner, isAppUser] = useStoreShallow(store => [
    store.api,
    store.currentStreamHost === store.user?.id,
    store.user?.id === data.id,
  ]);

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

        {isAppUser && (
          <Text weight="bold" color="boulder" size="xsmall">
            you
          </Text>
        )}

        {isStreamOwner && (
          <View style={styles.actionWrapper}>
            <SmallTextButton onPress={onAllow} title="Accept" />
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
  },
  actionWrapper: {
    marginTop: 10,
  },
  name: {},
  text: {
    marginLeft: 10,
  },
});

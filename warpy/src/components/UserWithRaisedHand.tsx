import React from 'react';
import {Participant} from '@app/models';
import {Avatar} from './Avatar';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {SmallTextButton} from './SmallTextButton';

interface IRaisedHandInfo {
  data: Participant;
}

export const UserWithRaisedHand = (props: IRaisedHandInfo) => {
  const {data} = props;

  const name = `${data.first_name} ${data.last_name}`;
  return (
    <View style={styles.wrapper}>
      <Avatar user={data} />
      <View style={styles.text}>
        <Text weight="bold" style={styles.name} size="small">
          {name}
        </Text>
        <SmallTextButton title="Accept" />
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

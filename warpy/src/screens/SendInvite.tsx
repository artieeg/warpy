import {ScreenHeader} from '@app/components';
import {useAppInviteCode} from '@app/hooks';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@app/components';
import {TextButton} from '@app/components/TextButton';

export const SendInvite = () => {
  const {data} = useAppInviteCode();
  console.log({data});

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      {data && (
        <View style={styles.invite}>
          <Text color="yellow" size="large">
            {data.invite.code}
          </Text>
          <Text color="info" size="small" style={styles.info}>
            both you & your signed up{'\n'}friend will get 3000 coins!
          </Text>
        </View>
      )}
      <TextButton title="share your invite link" style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  invite: {
    flex: 1,
    paddingBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

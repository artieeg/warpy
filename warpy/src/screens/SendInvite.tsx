import {ScreenHeader, textStyles} from '@app/components';
import {useAppInviteCode} from '@app/hooks';
import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@app/components';
import {TextButton} from '@app/components/TextButton';
import {IconButton} from '@app/components/IconButton';
import {useStoreShallow} from '@app/store';

export const SendInvite = () => {
  const [api, user] = useStoreShallow(state => [state.api, state.user!.id]);
  const {data, refetch} = useAppInviteCode();

  const onRefresh = useCallback(async () => {
    await api.user.refreshAppInvite(user);

    refetch();
  }, [api, user, refetch]);

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
          <IconButton
            onPress={onRefresh}
            style={styles.update}
            color={textStyles.yellow.color}
            size={40}
            name="refresh"
          />
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
  update: {
    marginTop: 10,
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

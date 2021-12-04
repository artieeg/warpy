import {ScreenHeader, textStyles} from '@app/components';
import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@app/components';
import {TextButton} from '@warpy/components';
import {IconButton} from '@app/components/IconButton';
import {useStore, useStoreShallow} from '@app/store';
import config from '@app/config';
import Share from 'react-native-share';

export const SendInvite = () => {
  const [api, user, appInvite] = useStoreShallow(state => [
    state.api,
    state.user!.id,
    state.appInvite,
  ]);

  const onRefresh = useCallback(async () => {
    useStore.getState().dispatchAppInviteUpdate();
  }, [api, user]);

  const onShare = useCallback(() => {
    const url = `${config.domain}/invite/${appInvite?.id}`;

    Share.open({
      message: url,
    });
  }, [appInvite]);

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      {appInvite && (
        <View style={styles.invite}>
          <Text selectable color="yellow" size="large">
            {appInvite.code}
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
      <TextButton
        onPress={onShare}
        title="share your invite link"
        style={styles.button}
      />
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

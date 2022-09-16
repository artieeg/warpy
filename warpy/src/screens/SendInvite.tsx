import {ScreenHeader} from '@app/components';
import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@app/components';
import {TextButton} from '@warpy/components';
import {IconButton} from '@app/components/IconButton';
import {useDispatcher, useStoreShallow} from '@app/store';
import config from '@app/config';
import Share from 'react-native-share';
import {colors} from '@app/theme';

export const SendInvite = () => {
  const [api, user, appInvite] = useStoreShallow(state => [
    state.api,
    state.user!.id,
    state.appInvite,
  ]);

  const dispatch = useDispatcher();

  const onRefresh = useCallback(async () => {
    dispatch(({app_invite}) => app_invite.update());
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
          <Text color="boulder" size="small" style={styles.info}>
            both you & your signed up{'\n'}friend will get 3000 coins!
          </Text>
          <IconButton
            onPress={onRefresh}
            style={styles.update}
            color={colors.yellow}
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

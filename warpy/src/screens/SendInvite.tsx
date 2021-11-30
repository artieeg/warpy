import {ScreenHeader, textStyles} from '@app/components';
import {useAppInviteCode} from '@app/hooks';
import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@app/components';
import {TextButton} from '@warpy/components';
import {IconButton} from '@app/components/IconButton';
import {useStoreShallow} from '@app/store';
import config from '@app/config';
import Share from 'react-native-share';

export const SendInvite = () => {
  const [api, user] = useStoreShallow(state => [state.api, state.user!.id]);
  const {data, refetch} = useAppInviteCode();

  const onRefresh = useCallback(async () => {
    await api.app_invite.refresh();

    refetch();
  }, [api, user, refetch]);

  const onShare = useCallback(() => {
    const url = `${config.domain}/invite/${data?.invite.id}`;

    Share.open({
      message: url,
    });
  }, [data?.invite]);

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      {data && (
        <View style={styles.invite}>
          <Text selectable color="yellow" size="large">
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

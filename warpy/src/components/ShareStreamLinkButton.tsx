import config from '@app/config';
import {useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Share from 'react-native-share';
import {colors} from '../../colors';
import {Icon} from './Icon';
import {Text} from './Text';

export const ShareStreamLinkButton = () => {
  const [appInvite, stream] = useStoreShallow(state => [
    state.appInvite,
    state.stream,
  ]);

  const onShare = useCallback(() => {
    const url = `${config.domain}/stream/${stream}?rid=${appInvite?.id}`;

    Share.open({
      message: url,
    });
  }, [appInvite]);

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onShare}>
      <View style={styles.iconContainer}>
        <Icon name="share" size={30} color={colors.green} />
      </View>
      <View style={styles.info}>
        <Text size="small">share a link</Text>
        <Text color="boulder" size="xsmall">
          and get coins
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#474141',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginLeft: 20,
    alignSelf: 'center',
  },
});

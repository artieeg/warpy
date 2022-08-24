import config from '@app/config';
import {useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import Share from 'react-native-share';
import {IconButton} from './IconButton';

export const ShareButton = () => {
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

  return <IconButton onPress={onShare} size={24} name="share" color="#fff" />;
};

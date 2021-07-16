import {Button, RemoteStream, Text} from '@app/components';
import {useFeed} from '@app/hooks';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';

export const Feed = () => {
  const feed = useFeed();

  return <View>{feed.feed[0] && <RemoteStream stream={feed.feed[0]} />}</View>;
};

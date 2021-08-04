import {Button, RemoteStream} from '@app/components';
import {useFeed} from '@app/hooks';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';

export const Feed = () => {
  const feed = useFeed();

  const navigation = useNavigation();

  return (
    <View>
      {feed[0] ? (
        <RemoteStream stream={feed[0]} />
      ) : (
        <Button
          title="Start new stream"
          onPress={() => {
            navigation.navigate('NewStream');
          }}
        />
      )}
    </View>
  );
};

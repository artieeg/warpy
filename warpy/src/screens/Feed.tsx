import {useFeed} from '@app/hooks';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Button, Text} from 'react-native';

export const Feed = () => {
  const feed = useFeed();
  const navigation = useNavigation();

  return (
    <View>
      <Text>Feed</Text>
      <Button
        onPress={() => {
          navigation.navigate('NewStream');
        }}
        title="start a stream"
      />
    </View>
  );
};

import {Avatar, Button, RemoteStream, Text} from '@app/components';
import {useAppUser, useFeed} from '@app/hooks';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';

export const Feed = () => {
  const feed = useFeed();

  const navigation = useNavigation();
  const user = useAppUser();

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text size="large" weight="extraBold">
          /feed
        </Text>
        <Avatar user={user!} />
      </View>
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

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

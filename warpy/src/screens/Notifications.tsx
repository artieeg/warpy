import {
  Avatar,
  Notification,
  OpenHomeButton,
  StartNewStreamButton,
  Text,
} from '@app/components';
import {useNotifications} from '@app/hooks';
import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

export const Notifications = () => {
  const {notifications, fetchMoreNotifications} = useNotifications();
  const user = useStore.use.user();
  const navigation = useNavigation();

  const onStartStream = () => {
    navigation.navigate('NewStream');
  };

  const onOpenFeed = () => {
    navigation.navigate('Feed');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text size="large" weight="extraBold">
          /news
        </Text>
        <View style={styles.row}>
          <OpenHomeButton style={styles.headerButton} onPress={onOpenFeed} />
          <StartNewStreamButton
            style={styles.headerButton}
            onPress={onStartStream}
          />
          <Avatar user={user!} />
        </View>
      </View>
      <FlatList
        data={notifications}
        renderItem={({item}) => <Notification notification={item} />}
        onEndReached={fetchMoreNotifications}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 10,
  },
});

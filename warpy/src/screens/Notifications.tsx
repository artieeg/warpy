import {Notification} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {useNotifications} from '@app/hooks';
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

export const Notifications = () => {
  const {notifications, fetchMoreNotifications} = useNotifications();

  return (
    <View style={styles.screen}>
      <ScreenHeader />
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

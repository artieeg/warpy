import {useStore} from '@app/store';
import {useRoute} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useAsyncMemo} from 'use-async-memo';
import shallow from 'zustand/shallow';

export const UserScreen = () => {
  const [api] = useStore(store => [store.api], shallow);
  const id = (useRoute().params as any)['id'] as string;

  const data = useAsyncMemo(() => api.user.get(id), [id]);

  return <View></View>;
};

const styles = StyleSheet.create({});

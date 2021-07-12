import {useAppUser} from '@app/hooks';
import React from 'react';
import {View} from 'react-native';

export const NewStream = () => {
  const [user] = useAppUser();

  return (
    <View>
      <View />
    </View>
  );
};

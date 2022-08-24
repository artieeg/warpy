import React from 'react';
import {View} from 'react-native';
import {Text} from './Text';

export const ScreenTitle: React.FC<{}> = ({children}) => {
  return (
    <View>
      <Text size="large" weight="extraBold">
        {children}
      </Text>
    </View>
  );
};

import {useStoreShallow} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {Text} from '@warpy/components';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../../colors';

const useInfoHeaderController = () => {
  const [previousStreamData] = useStoreShallow(store => [
    store.previousStreamData,
  ]);

  let mode: string | null = null;

  if (previousStreamData) {
    mode = 'previous-stream';
  }

  const navigation = useNavigation();

  const onPress = React.useCallback(() => {
    if (mode === 'previous-stream') {
      navigation.navigate('Stream', {stream: previousStreamData});
    }
  }, [mode, previousStreamData]);

  return {
    visible: !!previousStreamData,
    mode,
    onPress,
  };
};

export const INFO_HEADER_HEIGHT = 50;

export const InfoHeader = () => {
  const {visible, onPress, mode} = useInfoHeaderController();

  const height = useDerivedValue(() => {
    if (visible) {
      return 0;
    } else {
      return -INFO_HEADER_HEIGHT;
    }
  }, [visible]);

  const style = useAnimatedStyle(() => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: withTiming(height.value, {duration: 200}),
      overflow: 'hidden',
    };
  }, [height]);

  return (
    <Animated.View style={style}>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={onPress}>
          <Text size="xsmall" color="white" weight="bold">
            {mode === 'previous-stream' && 'join previous stream >'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: INFO_HEADER_HEIGHT,
    backgroundColor: colors.blue,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

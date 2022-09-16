import React from 'react';
import {View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {Text} from '@app/components';
import {TextButton} from '@warpy/components';
import {useNavigation} from '@react-navigation/native';

export const OnboardOverlay: React.FC<{visible: boolean}> = ({visible}) => {
  const navigation = useNavigation();

  const onboardOverlayProgress = useDerivedValue(
    () =>
      withTiming(visible ? 1 : 0, {
        duration: 600,
        easing: Easing.ease,
      }),
    [visible],
  );

  const onboardOverlayWrapperStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    opacity: onboardOverlayProgress.value,
  }));

  return (
    <Animated.View style={onboardOverlayWrapperStyle}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center',
            translateY: 40,
          },
        ]}
      >
        <Text color="gray" style={{textAlign: 'center'}} size="xxsmall">
          welcome on board,{'\n'}epic human
        </Text>
      </Animated.View>
      <View style={{flex: 1}} />
      <View style={{paddingBottom: 15, width: '100%', alignItems: 'center'}}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 30,
            alignItems: 'center',
          }}
        >
          <TextButton
            onPress={() => (navigation as any).navigate('SignUpUsername')}
            style={{width: '100%'}}
            title="join warpy"
          />
          {/*
          <View style={{paddingTop: 15}}>
            <Text size="xxsmall" color="white">
              skip
            </Text>
          </View>
            */}
        </View>
      </View>
    </Animated.View>
  );
};

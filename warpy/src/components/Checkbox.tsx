import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

interface ICheckboxProps {
  visible: boolean;
  onToggle: () => void;
}

export const Checkbox = ({visible, onToggle}: ICheckboxProps) => {
  const scale = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(scale.current, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const animated = {
    transform: [{scale: scale.current}],
  };

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <View style={styles.wrapper}>
        <Animated.View style={[animated, styles.fill]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#202020',
  },
  fill: {
    backgroundColor: '#F9F871',
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    left: -3,
    top: -3,
  },
});

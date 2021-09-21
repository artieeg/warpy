import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {Text} from './Text';
import Modal from 'react-native-modal';

export interface IActionSheetProps {
  visible: boolean;
  onHide: () => void;
  actions: (IActionButtonProps | null)[];
}

export interface IActionButtonProps extends TouchableOpacityProps {
  title: string;
  color?: 'alert' | 'bright';
}

export const ActionSheetButton = (props: IActionButtonProps) => {
  const {title, color} = props;

  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, styles.bottomBorder, props.style]}>
      <Text size="small" color={color || 'bright'} weight="bold">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ActionSheet = (props: IActionSheetProps) => {
  const {visible, onHide, actions} = props;

  const opacity = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(opacity.current, {
        toValue: visible ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const filteredActions = actions.filter(
    action => action !== null,
  ) as IActionButtonProps[];

  const animatedStyle = {
    opacity: opacity.current,
  };

  return (
    <Modal
      isVisible={visible}
      onModalHide={onHide}
      animationInTiming={400}
      animationOutTiming={400}
      style={styles.modal}
      statusBarTranslucent>
      <Animated.View style={animatedStyle}>
        <View style={[styles.background, styles.actions]}>
          {filteredActions.map(({title, color, onPress}) => (
            <ActionSheetButton
              title={title}
              color={color}
              onPress={e => {
                onHide();
                if (onPress) {
                  onPress(e);
                }
              }}
              key={title}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={onHide}
          style={[styles.background, styles.cancel, styles.button]}>
          <Text size="small" weight="bold">
            cancel
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    borderRadius: 10,
    backgroundColor: '#000',
  },
  actions: {
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  cancel: {},
  modal: {
    padding: 30,
    margin: 0,
    justifyContent: 'flex-end',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#101010',
  },
});

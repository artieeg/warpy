import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

interface IToggleMicButtonProps {
  on: boolean;
  style?: any;
  onPress: () => any;
}

export const ToggleMicButton = (props: IToggleMicButtonProps) => {
  const {style, on, onPress} = props;

  return (
    <RoundButton onPress={onPress} style={[on && styles.micOnButton, style]}>
      <Icon
        name={on ? 'mic-on' : 'mic-off'}
        size={30}
        color={on ? '#110E11' : '#EEE5E9'}
      />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  micOnButton: {
    backgroundColor: '#EEE5E9',
  },
});

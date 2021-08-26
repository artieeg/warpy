import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

interface IStartNewSteramButtonProps {
  onPress: () => any;
  style: any;
}

export const StartNewStreamButton = (props: IStartNewSteramButtonProps) => {
  const {onPress, style} = props;

  return (
    <RoundButton style={[style, styles.button]} onPress={onPress}>
      <Icon name="plus" size={24} color="#BDF971" />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
  },
});

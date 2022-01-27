import React from 'react';
import {StyleSheet} from 'react-native';
import {Plus} from './icons';
import {RoundButton} from './RoundButton';

interface IStartNewSteramButtonProps {
  onPress: () => any;
  style: any;
}

export const StartNewStreamButton = (props: IStartNewSteramButtonProps) => {
  const {onPress, style} = props;

  return (
    <RoundButton style={[style, styles.button]} onPress={onPress}>
      <Plus width={22} height={22} fill="#BDF971" />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
  },
});

import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

interface IStartNewSteramButtonProps {
  onPress: () => any;
  style: any;
}

export const SearchButton = (props: IStartNewSteramButtonProps) => {
  const {onPress, style} = props;

  return (
    <RoundButton style={[style, styles.button]} onPress={onPress}>
      <Icon name="search" size={20} color="#BDF971" />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
  },
});

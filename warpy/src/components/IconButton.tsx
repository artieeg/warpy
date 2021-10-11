import React from 'react';
import {StyleSheet} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

interface IIconButtonProps extends IconProps, IRoundButtonProps {
  onPress?: () => any;
  style?: any;
  hasBackground?: boolean;
}

export const IconButton = (props: IIconButtonProps) => {
  const {hasBackground} = props;

  return (
    <RoundButton
      {...props}
      style={[!hasBackground && styles.transparent, props.style]}>
      <Icon {...props} />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  transparent: {
    backgroundColor: '#00000000',
  },
});

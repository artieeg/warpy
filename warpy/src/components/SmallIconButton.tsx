import React from 'react';
import {ButtonProps, StyleSheet, TouchableOpacity} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import {Colors, colors} from '../../colors';
import {Icon} from './Icon';

interface SmallIconButtonProps extends IconProps {
  color?: Colors;
}

export const SmallIconButton = (props: SmallIconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.button,
        {backgroundColor: colors[props.color || 'green']},
      ]}>
      <Icon {...props} size={30} color={colors.cod_gray} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

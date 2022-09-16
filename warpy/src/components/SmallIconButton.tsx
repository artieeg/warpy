import React from 'react';
import {ButtonProps, StyleSheet, TouchableOpacity} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import {Colors, colors} from '@app/theme';
import {Icon} from './Icon';

interface SmallIconButtonProps extends IconProps {
  background?: Colors;
  color?: Colors;
}

export const SmallIconButton = ({
  color,
  background,
  ...props
}: SmallIconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, {backgroundColor: colors[background || 'green']}]}>
      <Icon
        {...props}
        size={props.size ?? 30}
        color={color ? colors[color] : colors.cod_gray}
      />
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

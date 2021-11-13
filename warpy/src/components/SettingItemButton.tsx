import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from './Icon';
import {Text} from './Text';

interface SettingItemButtonProps {
  onPress: () => any;
  icon: string;
  title: string;
  color: string;
}

export const SettingItemButton = (props: SettingItemButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.wrapper, styles.row]}>
      <View style={styles.row}>
        <Icon
          name={props.icon}
          size={20}
          style={[styles.icon, {backgroundColor: props.color}]}
        />
        <Text size="small" style={[{color: props.color}]}>
          {props.title}
        </Text>
      </View>
      <Icon name="chevron-right" size={30} color={props.color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    padding: 10,
    borderRadius: 40,
    marginRight: 10,
  },
});

import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {IStreamCategory} from '../../../lib';
import {Text, textStyles} from './Text';

interface StreamCategoryOptionProps {
  category: IStreamCategory;
  color: string;
  selected: boolean;
  onPress: () => any;
}

export const StreamCategoryOption = React.memo(
  ({category, color, selected, onPress}: StreamCategoryOptionProps) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.wrapper, selected && {backgroundColor: color}]}>
        <Text
          size="small"
          style={[{color: selected ? textStyles.dark.color : color}]}>
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginRight: 10,
  },
});

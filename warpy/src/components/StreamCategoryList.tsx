import {useStore} from '@app/store';
import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, ScrollView, ViewProps} from 'react-native';
import {StreamCategoryOption} from './StreamCategoryOption';
import tinycolor from 'tinycolor2';
import {IStreamCategory} from '@warpy/lib';

const BASE_COLOR = tinycolor('F9AA71');

interface StreamCategoryListProps extends ViewProps {
  mode?: 'create-stream' | 'browse-feed';
}

export const StreamCategoryList: React.FC<StreamCategoryListProps> = props => {
  const categories = useMemo(() => {
    if (props.mode === 'create-stream') {
      return useStore.getState().categories.filter(i => i.id !== 'foru');
    }

    return useStore.getState().categories;
  }, []);

  const selectedCategoryIds = useStore(state => state.selectedCategoryIds);

  const colors = useMemo(() => {
    const colors = [BASE_COLOR];

    for (let i = 1; i < categories.length; i++) {
      colors.push(
        tinycolor(colors[i - 1].toHexString()).spin(
          360 / (categories.length - 1),
        ),
      );
    }

    return colors;
  }, [categories]);

  const onSelectOption = useCallback(
    (streamCategory: IStreamCategory, isSelected: boolean) => {
      if (props.mode === 'create-stream') {
        useStore.getState().set({
          streamCategory,
        });
      } else {
        useStore
          .getState()
          .dispatchCategoryToggle(streamCategory.id, isSelected);
      }
    },
    [props.mode],
  );

  const renderItem = useCallback(
    (category: IStreamCategory, index: number) => {
      const isSelected =
        props.mode === 'browse-feed'
          ? selectedCategoryIds.includes(category.id)
          : useStore.getState().streamCategory?.id === category.id;

      return (
        <StreamCategoryOption
          key={category.id}
          selected={isSelected}
          color={colors[index].toHexString()}
          category={category}
          onPress={() => onSelectOption(category, !isSelected)}
        />
      );
    },
    [categories, props.mode],
  );

  return (
    <View style={[styles.wrapper, props.style]}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        centerContent
        horizontal
        contentContainerStyle={styles.container}>
        {categories.map(renderItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {},
});

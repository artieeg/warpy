import {useStore, useStoreShallow} from '@app/store';
import React, {useMemo} from 'react';
import {View, StyleSheet, FlatList, ScrollView} from 'react-native';
import {StreamCategoryOption} from './StreamCategoryOption';
import tinycolor from 'tinycolor2';

const BASE_COLOR = tinycolor('F9AA71');

export const StreamCategoryList = () => {
  const categories = useStore(state => state.categories);

  const selectedCategoryIds = useStore(state => state.selectedCategoryIds);

  const colors = useMemo(() => {
    const colors = [BASE_COLOR];

    for (let i = 1; i < categories.length; i++) {
      colors.push(
        tinycolor(colors[i - 1].toHexString()).spin(
          (i * 360) / categories.length,
        ),
      );
    }

    return colors;
  }, [categories]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        centerContent
        horizontal
        contentContainerStyle={styles.container}>
        {categories.map((category, index) => (
          <StreamCategoryOption
            key={category.id}
            selected={selectedCategoryIds.includes(category.id)}
            color={colors[index].toHexString()}
            category={category}
            onPress={() =>
              useStore
                .getState()
                .dispatchCategoryToggle(
                  category.id,
                  !selectedCategoryIds.includes(category.id),
                )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {},
});

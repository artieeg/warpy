import {useStore} from '@app/store';
import React, {useCallback} from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import shallow from 'zustand/shallow';
import {useQuery} from 'react-query';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {Text} from './Text';
import {AwardOption} from './AwardOption';

export const AwardPickerModal = (props: IBaseModalProps) => {
  const [api, visible, username] = useStore(
    useCallback(
      state => [
        state.api,
        state.modalCurrent === 'award',
        state.modalUserToAward
          ? state.streamers[state.modalUserToAward]?.username
          : null,
        state.awardModels,
        state.dispatchFetchAvailableAwards,
      ],
      [],
    ),
    shallow,
  );

  const {data} = useQuery('award-models', api.awards.getAvailable, {
    notifyOnChangeProps: ['data'],
  });

  const cellWidth =
    (useWindowDimensions().width - styles.wrapper.paddingHorizontal * 2) / 4;

  const minHeight = useWindowDimensions().height * 0.8;

  const cellStyle = {
    width: cellWidth,
    height: cellWidth + 20,
    //overflow: 'hidden',
  };

  return (
    <BaseSlideModal
      {...props}
      style={{minHeight}}
      visible={visible}
      title="send award">
      <View style={styles.wrapper}>
        <Text size="xsmall" color="info">
          to @{username}
        </Text>
        <FlatList
          numColumns={4}
          data={data?.awards}
          renderItem={({item}) => (
            <View style={[cellStyle, styles.cell]}>
              <AwardOption award={item} />
            </View>
          )}
        />
      </View>
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
  cell: {
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});

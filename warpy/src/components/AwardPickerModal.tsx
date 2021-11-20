import {useStore} from '@app/store';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import shallow from 'zustand/shallow';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {Text} from './Text';

export const AwardPickerModal = (props: IBaseModalProps) => {
  const [visible, username] = useStore(
    useCallback(
      state => [
        state.modalCurrent === 'award',
        state.modalUserToAward
          ? state.streamers[state.modalUserToAward]?.username
          : null,
      ],
      [],
    ),
    shallow,
  );

  console.log({visible});

  return (
    <BaseSlideModal {...props} visible={visible} title="send award">
      <View style={styles.wrapper}>
        <Text size="xsmall" color="info">
          to @{username}
        </Text>
      </View>
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
});

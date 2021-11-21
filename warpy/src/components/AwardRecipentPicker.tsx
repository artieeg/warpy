import {useStoreShallow} from '@app/store';
import React, {useMemo} from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {AudioRoomParticipant} from './AudioRoomParticipant';
import {BaseSlideModal} from './BaseSlideModal';

export const AwardRecipentPicker = () => {
  const [visible, streamers, dispatchModalOpen] = useStoreShallow(state => [
    state.modalCurrent === 'award-recipent',
    state.streamers,
    state.dispatchModalOpen,
  ]);

  const users = useMemo(() => Object.values(streamers), [streamers]);
  const {width} = useWindowDimensions();
  const cellStyle = useMemo(
    () => ({
      width: (width - 40) / 3,
      alignItems: 'center' as any,
    }),
    [width],
  );

  return (
    <BaseSlideModal
      style={styles.modal}
      visible={visible}
      title={'pick a speaker' + `\n` + 'to award'}>
      <FlatList
        data={users}
        numColumns={3}
        renderItem={({item}) => (
          <View style={cellStyle}>
            <AudioRoomParticipant
              onPress={() => dispatchModalOpen('award', {userToAward: item.id})}
              data={item}
            />
          </View>
        )}
      />
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '80%',
  },
});

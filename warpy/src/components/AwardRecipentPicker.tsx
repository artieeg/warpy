import {useStoreShallow} from '@warpy/store';
import React, {useMemo} from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {ParticipantView} from './ParticipantView';

export const AwardRecipentPicker = () => {
  const [visible, streamers, dispatchModalOpen, us] = useStoreShallow(state => [
    state.modalCurrent === 'award-recipent',
    state.streamers,
    state.dispatchModalOpen,
    state.user?.id,
  ]);

  const users = useMemo(
    () => Object.values(streamers).filter(streamer => streamer.id !== us),
    [streamers, us],
  );
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
            <ParticipantView
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

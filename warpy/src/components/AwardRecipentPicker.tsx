import {useDispatcher, useStoreShallow} from '@app/store';
import React, {useMemo} from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {ParticipantView} from './ParticipantView';

export const AwardRecipentPicker = () => {
  const dispatch = useDispatcher();
  const [visible, streamers, us] = useStoreShallow(state => [
    state.modalCurrent === 'award-recipent',
    state.streamers,
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
              onPress={() =>
                dispatch(({modal}) => modal.open('award', {userToAward: item}))
              }
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

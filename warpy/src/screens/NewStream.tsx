import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {StreamOverlay} from '@app/components/StreamOverlay';
import {Room} from '@app/components/Room';
import {useDispatcher, useStore} from '@app/store';
import {NewStreamPanel} from '@app/components/NewStreamPanel';
import {AwardDisplay} from '@app/components/AwardDisplay';
import {useRoute} from '@react-navigation/native';

export const useNewStreamController = () => {
  const dispatch = useDispatcher();
  const streamId = useStore(state => state.stream);

  const params = useRoute().params as any;

  //Cancel the start room together timeout if it exists
  useEffect(() => {
    return () => {
      if (params?.startRoomTogetherTimeout) {
        clearTimeout(params.startRoomTogetherTimeout);
      }
    };
  }, [params?.startRoomTogetherTimeout]);

  useEffect(() => {
    dispatch(({media}) => media.requestMediaStream('audio', {enabled: true}));
    dispatch(({media}) => media.requestMediaStream('video', {enabled: true}));

    //close streams
    return () => {
      dispatch(({media}) => media.close());

      useStore.setState({
        title: null,
        stream: null,
      });
    };
  }, []);

  return {streamId};
};

export const NewStream = () => {
  const {streamId} = useNewStreamController();

  return (
    <View style={styles.wrapper}>
      <Room />

      {streamId && <StreamOverlay />}
      {streamId && <AwardDisplay />}

      {!streamId && <NewStreamPanel />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#303030',
  },
});

import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {StreamOverlay} from '@app/components/StreamOverlay';
import {Room} from '@app/components/Room';
import {useStore, useStoreShallow} from '@app/store';
import {NewStreamPanel} from '@app/components/NewStreamPanel';
import {AwardDisplay} from '@app/components/AwardDisplay';
import {useRoute} from '@react-navigation/native';

export const useNewStreamController = () => {
  const [streamId, dispatchMediaRequest] = useStoreShallow(state => [
    state.stream,
    state.dispatchMediaRequest,
  ]);

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
    dispatchMediaRequest('audio', {enabled: true});
    dispatchMediaRequest('video', {enabled: true});

    //close streams
    return () => {
      useStore.getState().dispatchMediaClose();

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
  localStream: {
    backgroundColor: '#303030',
  },
  allowSpeaking: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  startStreamButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#303030',
  },
});

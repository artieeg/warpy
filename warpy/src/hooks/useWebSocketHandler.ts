import {APIClient} from '@warpy/api';
import {Participant} from '@app/models';
import {useParticipantsStore} from '@app/stores';
import {useEffect} from 'react';
import {Alert} from 'react-native';

export const useWebSocketHandler = (api: APIClient) => {
  useEffect(() => {
    api.stream.onNewViewer(data => {
      useParticipantsStore.getState().addViewer(data.viewer);
    });

    api.stream.onActiveSpeaker(data => {
      Alert.alert('active speaker', data.speaker.id);
    });

    api.stream.onNewRaisedHand(data => {
      const participant = Participant.fromJSON(data.viewer);
      participant.isRaisingHand = true;

      useParticipantsStore.getState().raiseHand(participant);
    });

    api.stream.onNewSpeaker(data => {
      const {speaker} = data;

      useParticipantsStore.getState().addSpeaker(speaker);
    });

    api.stream.onUserLeft(data => {
      const {user} = data;

      useParticipantsStore.getState().removeParticipant(user);
    });

    return () => {
      api.observer.removeAllListeners();
    };
  }, [api]);
};

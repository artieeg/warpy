import {APIClient} from '@app/api_client';
import {Participant, Stream, User} from '@app/models';
import {useFeedStore, useParticipantsStore, useUserStore} from '@app/stores';
import {useEffect} from 'react';

export const useWebSocketHandler = (api: APIClient) => {
  useEffect(() => {
    api.stream.onNewViewer(data => {
      useParticipantsStore.getState().addViewer(data.viewer);
    });

    api.stream.onNewRaisedHand(data => {
      const participant = Participant.fromJSON(data.viewer);
      participant.isRaisingHand = true;

      useParticipantsStore.getState().raiseHand(participant);
    });

    api.stream.onUserLeft(data => {
      useParticipantsStore.getState().removeParticipant(data.user);
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

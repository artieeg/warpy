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

    api.observer.on('created-room', (data: any) => {
      const {speakers} = data;

      useParticipantsStore.getState().set({
        participants: [...speakers],
      });
    });

    api.stream.onNewSpeaker(data => {
      const {speaker} = data;

      useParticipantsStore.getState().addSpeaker(speaker);
    });

    api.stream.onUserLeft(data => {
      const {user} = data;

      useParticipantsStore.getState().removeParticipant(user);
    });

    api.observer.on('room-info', (data: any) => {
      const {speakers, raisedHands, count} = data;

      useParticipantsStore.getState().set({
        participants: [...speakers, ...raisedHands],
        count,
        page: -1,
      });
    });

    return () => {
      api.observer.removeAllListeners();
    };
  }, [api]);
};

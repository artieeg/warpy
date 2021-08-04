import {APIClient} from '@app/api_client';
import {Participant, Stream, User} from '@app/models';
import {useFeedStore, useParticipantsStore, useUserStore} from '@app/stores';
import {useEffect} from 'react';

export const useWebSocketHandler = (api: APIClient) => {
  useEffect(() => {
    api.observer.on('viewers', (data: any) => {
      const {page, viewers} = data;

      useParticipantsStore.getState().addViewers(viewers, page);
    });

    api.observer.on('new-viewer', (data: any) => {
      useParticipantsStore.getState().addViewer(data.viewer);
    });

    api.observer.on('raise-hand', (data: any) => {
      const participant = Participant.fromJSON(data.viewer);
      participant.isRaisingHand = true;

      useParticipantsStore.getState().raiseHand(participant);
    });

    api.observer.on('user-left', (data: any) => {
      useParticipantsStore.getState().removeParticipant(data.user);
    });

    api.observer.on('created-room', (data: any) => {
      const {speakers} = data;

      useParticipantsStore.getState().set({
        participants: [...speakers],
      });
    });

    api.observer.on('new-speaker', (data: any) => {
      const {speaker} = data;

      useParticipantsStore.getState().addSpeaker(speaker);
    });

    api.observer.on('user-left', (data: any) => {
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

    api.observer.on('whoami', (data: any) => {
      const {user} = data;
      console.log('received user info', user);

      useUserStore.getState().set({
        user: User.fromJSON(user),
      });
    });

    api.observer.on('feed', (data: any) => {
      const {feed} = data;

      console.log('feed', feed);

      useFeedStore
        .getState()
        .addStreams(feed.map((stream: any) => Stream.fromJSON(stream)));
    });

    return () => {
      api.observer.removeAllListeners();
    };
  }, [api]);
};

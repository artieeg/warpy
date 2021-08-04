import {ProvidedWebSocket} from '@app/components';
import {Participant, Stream, User} from '@app/models';
import {useFeedStore, useParticipantsStore, useUserStore} from '@app/stores';
import {useEffect} from 'react';

export const useWebSocketHandler = (ws: ProvidedWebSocket) => {
  useEffect(() => {
    ws.on('viewers', (data: any) => {
      const {page, viewers} = data;

      useParticipantsStore.getState().addViewers(viewers, page);
    });

    ws.on('new-viewer', (data: any) => {
      useParticipantsStore.getState().addViewer(data.viewer);
    });

    ws.on('raise-hand', (data: any) => {
      const participant = Participant.fromJSON(data.viewer);
      participant.isRaisingHand = true;

      useParticipantsStore.getState().raiseHand(participant);
    });

    ws.on('user-left', (data: any) => {
      useParticipantsStore.getState().removeParticipant(data.user);
    });

    ws.on('created-room', (data: any) => {
      const {speakers} = data;

      useParticipantsStore.getState().set({
        participants: [...speakers],
      });
    });

    ws.on('new-speaker', (data: any) => {
      const {speaker} = data;

      useParticipantsStore.getState().addSpeaker(speaker);
    });

    ws.on('user-left', (data: any) => {
      const {user} = data;

      useParticipantsStore.getState().removeParticipant(user);
    });

    ws.on('room-info', (data: any) => {
      const {speakers, raisedHands, count} = data;

      useParticipantsStore.getState().set({
        participants: [...speakers, ...raisedHands],
        count,
        page: -1,
      });
    });

    ws.on('whoami', (data: any) => {
      const {user} = data;
      console.log('received user info', user);

      useUserStore.getState().set({
        user: User.fromJSON(user),
      });
    });

    ws.on('feed', (data: any) => {
      const {feed} = data;

      console.log('feed', feed);

      useFeedStore
        .getState()
        .addStreams(feed.map((stream: any) => Stream.fromJSON(stream)));
    });

    return () => {
      ws.removeAllListeners();
    };
  }, [ws]);
};

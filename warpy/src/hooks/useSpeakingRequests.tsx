import {useWebSocketContext} from '@app/components';
import {Participant} from '@app/models/participant';
import {useCallback, useEffect, useState} from 'react';

export const useSpeakingRequests = (stream: string): Participant[] => {
  const [speakingRequests, setSpeakingRequests] = useState<Participant[]>([]);

  const ws = useWebSocketContext();
  const onRaiseHand = useCallback((data: any) => {
    const viewer = Participant.fromJSON(data.viewer);

    setSpeakingRequests(prev => [viewer, ...prev]);
  }, []);

  const onNewSpeaker = useCallback((data: any) => {
    const id = data.speaker.id;

    setSpeakingRequests(prev =>
      prev.filter(participant => participant.id !== id),
    );
  }, []);

  const onRoomInfo = useCallback((data: any) => {
    const {raisingHands} = data;

    const viewersRaisingHands = raisingHands.map((d: any) =>
      Participant.fromJSON(d),
    );

    setSpeakingRequests(viewersRaisingHands);
  }, []);

  useEffect(() => {
    ws.on('room-info', onRoomInfo);
    ws.on('raise-hand', onRaiseHand);
    ws.on('new-speaker', onNewSpeaker);

    return () => {
      ws.off('room-info', onRoomInfo);
      ws.off('new-speaker', onNewSpeaker);
      ws.off('raise-hand', onRaiseHand);
    };
  }, [ws, onRaiseHand, onRoomInfo, onNewSpeaker]);

  return speakingRequests;
};

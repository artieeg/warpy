import {Participant} from '@app/models';
import {useWebSocketContext} from '@app/components';
import {useCallback, useEffect, useState} from 'react';

export const useStreamSpeakers = (_stream: string) => {
  const [speakers, setSpeakers] = useState<Participant[]>([]);

  const ws = useWebSocketContext();

  const onRoomInfo = useCallback((data: any) => {
    const {speakers: speakersData} = data;

    const receivedSpeakers: Participant[] = speakersData.map((json: any) =>
      Participant.fromJSON(json),
    );

    setSpeakers(prev => [...prev, ...receivedSpeakers]);
  }, []);

  const onRoomCreated = useCallback((data: any) => {
    setSpeakers(prev => [...prev, ...data.speakers.map(Participant.fromJSON)]);
  }, []);

  const onNewSpeaker = useCallback((data: any) => {
    const {speaker: speakerData} = data;
    const speaker = Participant.fromJSON(speakerData);

    setSpeakers(prev => [...prev, speaker]);
  }, []);

  useEffect(() => {
    ws.once('room-info', onRoomInfo);
    ws.once('created-room', onRoomCreated);
    ws.on('new-speaker', onNewSpeaker);

    return () => {
      ws.off('new-speaker', onNewSpeaker);
    };
  }, [ws, onRoomInfo, onNewSpeaker, onRoomCreated]);

  return speakers;
};

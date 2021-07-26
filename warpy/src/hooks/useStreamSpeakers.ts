import {Participant} from '@app/models';
import {useWebSocketContext} from '@app/components';
import {useCallback, useEffect, useState} from 'react';

export const useStreamSpeakers = (_stream: string) => {
  const [speakers, setSpeakers] = useState<Participant[]>([]);

  const ws = useWebSocketContext();

  const onSpeakers = useCallback((data: any) => {
    const {speakers: speakersData} = data;

    const receivedSpeakers: Participant[] = speakersData.map((json: any) =>
      Participant.fromJSON(json),
    );

    console.log('received speakes', receivedSpeakers);

    setSpeakers(prev => [...prev, ...receivedSpeakers]);
  }, []);

  useEffect(() => {
    ws.once('room-info', onSpeakers);
  }, [ws, onSpeakers]);

  return speakers;
};

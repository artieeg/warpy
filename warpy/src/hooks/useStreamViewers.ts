import {Participant} from '@app/models';
import {useWebSocketContext} from '@app/components';
import {useCallback, useEffect, useState} from 'react';

export const useStreamViewers = (_stream: string) => {
  const [viewers, setViewers] = useState<Participant[]>([]);
  const [page, setPage] = useState(0);

  const ws = useWebSocketContext();

  const onViewersPage = useCallback((data: any) => {
    const {page: newPage, participants: participantsData} = data;

    const receivedViewers: Participant[] = participantsData.map((json: any) =>
      Participant.fromJSON(json),
    );

    setPage(newPage);

    setViewers(prev => [...prev, ...receivedViewers]);
  }, []);

  useEffect(() => {
    ws.on('viewers', onViewersPage);

    return () => {
      ws.off('viewers', onViewersPage);
    };
  }, [ws, onViewersPage]);

  return [viewers];
};

import {Participant} from '@app/models';
import {useWebSocketContext} from '@app/components';
import {useCallback, useEffect, useState} from 'react';

export const useStreamViewers = (stream: string) => {
  const [viewers, setViewers] = useState<Participant[]>([]);
  const [page, setPage] = useState(0);

  const ws = useWebSocketContext();

  const onViewersPage = useCallback((data: any) => {
    const {page: newPage, viewers: viewersData} = data;

    const receivedViewers: Participant[] = viewersData.map((json: any) =>
      Participant.fromJSON(json),
    );

    setPage(newPage);

    console.log('received viewers', receivedViewers);

    setViewers(prev => [...prev, ...receivedViewers]);
  }, []);

  const fetchViewers = useCallback(() => {
    ws.requestViewers(stream, page);
  }, [page, ws, stream]);

  useEffect(() => {
    ws.on('viewers', onViewersPage);

    return () => {
      ws.off('viewers', onViewersPage);
    };
  }, [ws, onViewersPage]);

  return [viewers, fetchViewers];
};

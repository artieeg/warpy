import {Participant} from '@app/models';
import {useWebSocketContext} from '@app/components';
import {useCallback, useEffect, useRef, useState} from 'react';

export const useStreamViewers = (
  stream: string,
): [Participant[], () => any] => {
  const [viewers, setViewers] = useState<Participant[]>([]);
  const page = useRef(-1);

  const ws = useWebSocketContext();

  const onViewersPage = useCallback((data: any) => {
    const {page: newPage, viewers: viewersData} = data;

    const receivedViewers: Participant[] = viewersData.map((json: any) =>
      Participant.fromJSON(json),
    );

    page.current = newPage;

    setViewers(prev => [...prev, ...receivedViewers]);
  }, []);

  const fetchViewers = useCallback(() => {
    ws.requestViewers(stream, page.current + 1);
  }, [ws, stream]);

  //Fetch first viewers after joining the room
  useEffect(() => {
    ws.once('room-info', () => {
      fetchViewers();
    });
  }, [ws, fetchViewers]);

  useEffect(() => {
    ws.on('viewers', onViewersPage);

    return () => {
      ws.off('viewers', onViewersPage);
    };
  }, [ws, onViewersPage]);

  return [viewers, fetchViewers];
};

import {Stream} from '@app/models';
import {get} from './api';

export const getFeed = async (hub?: string) => {
  const response = await get('feeds', {
    auth: true,
    params: {
      hub,
    },
  });

  const streams = response.data.streams.map((data: any) =>
    Stream.fromJSON(data),
  );

  return streams;
};

import {post} from './api';

/**
 * Creates new stream and returns stream id
 */
export const createStream = async (title: string, hub: string) => {
  const response = await post('streams', {
    auth: true,
    body: {
      title,
      hub,
    },
  });

  return response.data.stream_id;
};

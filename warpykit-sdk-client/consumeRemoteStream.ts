import {ConsumeRemoteStream} from './types';

export const consumeRemoteStream: ConsumeRemoteStream = async (
  consumerParameters,
  user,
  transport,
) => {
  const consumer = await transport.consume({
    ...consumerParameters,
    appData: {
      user,
      producerId: consumerParameters.producerId,
      mediaTag: 'remote-media',
    },
  });

  return consumer;
};

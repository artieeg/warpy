import { getMockedInstance } from '@warpy-be/utils';
import { createStreamFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { MessageService } from '../message';
import { StreamStore } from '../stream';
import { PreviousStreamService } from './previous-stream.service';
import { PreviousStreamStore } from './previous-stream.store';

describe('PreviousStreamService', () => {
  const previousStreamStore =
    getMockedInstance<PreviousStreamStore>(PreviousStreamStore);
  const messageService = getMockedInstance<MessageService>(MessageService);
  const streamStore = getMockedInstance<StreamStore>(StreamStore);

  const service = new PreviousStreamService(
    previousStreamStore as any,
    messageService as any,
    streamStore as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears stream', async () => {
    const id = 'stream0';
    await service.clearStream(id);
    expect(previousStreamStore.delStream).toBeCalledWith(id);
  });

  it('sets previous stream', async () => {
    const user = 'user0';
    const stream = 'stream0';

    await service.set(user, stream);

    expect(previousStreamStore.set).toBeCalledWith(user, stream);
  });

  describe('sending previous stream to user', () => {
    const userWithoutPreivousStream = 'user2';

    const userWithPreviousStream = 'user0';
    const previousStreamId = 'stream0';
    const previousStreamData = createStreamFixture();

    const userWithInvalidPreviousStream = 'user3';
    const invalidPreviousStreamId = 'stream1';

    when(previousStreamStore.get)
      .calledWith(userWithInvalidPreviousStream)
      .mockResolvedValue(invalidPreviousStreamId);

    when(streamStore.findById)
      .calledWith(previousStreamId)
      .mockResolvedValue(previousStreamData);

    when(streamStore.findById)
      .calledWith(invalidPreviousStreamId)
      .mockResolvedValue(null);

    when(previousStreamStore.get)
      .calledWith(userWithPreviousStream)
      .mockResolvedValue(previousStreamId);

    when(previousStreamStore.get)
      .calledWith(userWithoutPreivousStream)
      .mockResolvedValue(null);

    it('does nothing if previous stream id is invalid', async () => {
      await service.sendPreviousStream(userWithInvalidPreviousStream);

      expect(messageService.sendMessage).not.toBeCalled();
    });

    it('does nothing if previous stream not found', async () => {
      await service.sendPreviousStream(userWithoutPreivousStream);

      expect(messageService.sendMessage).not.toBeCalled();
    });

    it('sends previos stream data to user', async () => {
      await service.sendPreviousStream(userWithPreviousStream);

      expect(messageService.sendMessage).toBeCalledWith(
        userWithPreviousStream,
        {
          event: 'previous-stream',
          data: {
            stream: previousStreamData,
          },
        },
      );
    });
  });
});

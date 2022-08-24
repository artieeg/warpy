import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_CHAT_MESSAGE, getMockedInstance } from '@warpy-be/utils';
import { createParticipantFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { BroadcastService } from '../broadcast';
import { ParticipantService, ParticipantStore } from '../participant';
import { UserBlockService } from '../user-block';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);
  const participantService =
    getMockedInstance<ParticipantService>(ParticipantService);
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const userBlockService =
    getMockedInstance<UserBlockService>(UserBlockService);
  const broadcastService =
    getMockedInstance<BroadcastService>(BroadcastService);

  const service = new ChatService(
    events as any,
    participantService as any,
    participantStore as any,
    userBlockService as any,
    broadcastService as any,
  );

  const userIdsToBroadcastTo = ['1', '2', '3'];

  const userIdsThatBlockedUser = ['4', '5'];

  const userIdsThatAreBlockedByUser = ['7'];

  userBlockService.getBlockedByIds.mockResolvedValue(userIdsThatBlockedUser);
  userBlockService.getBlockedUserIds.mockResolvedValue(
    userIdsThatAreBlockedByUser,
  );

  participantStore.getParticipantIds.mockResolvedValue([
    ...userIdsToBroadcastTo,
    ...userIdsThatAreBlockedByUser,
    ...userIdsThatBlockedUser,
  ]);

  const msg = 'hello';

  const senderid = 'send-user0';
  const stream = 'chat-stream0';

  const participant = createParticipantFixture({
    id: senderid,
    stream,
  });

  when(participantService.get)
    .calledWith(senderid)
    .mockResolvedValue(participant);

  it('broadcasts new chat message to users on stream', async () => {
    await service.sendNewMessage(senderid, msg);

    expect(broadcastService.broadcast).toBeCalledWith(userIdsToBroadcastTo, {
      event: 'chat-message',
      data: {
        message: expect.objectContaining({
          message: msg,
          sender: participant,
        }),
      },
    });
  });

  it('emits chat message', async () => {
    await service.sendNewMessage(senderid, msg);

    expect(events.emit).toBeCalledWith(EVENT_CHAT_MESSAGE, {
      message: expect.objectContaining({
        message: msg,
        sender: participant,
      }),
    });
  });
});

import {
  createParticipantFixture,
  createRecvMediaParamsFixture,
  createSendMediaParamsFixture,
} from '@warpy-be/__fixtures__';
import { getTestModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { ParticipantModule } from './participant.module';
import { NjsParticipantService } from './participant.service';
import { mockedParticipantStore } from './store/store.mocks';
import { mockedStreamerService } from './streamer/streamer.mocks';
import { mockedViewerService } from './viewer/viewer.mocks';

describe('ParticipantService', () => {
  let participantService: NjsParticipantService;

  const mockedRecvMediaParams = createRecvMediaParamsFixture({});
  const mockedSendMediaParams = createSendMediaParamsFixture({});
  const mediaPermissionsToken = 'token0';

  beforeAll(async () => {
    /*
    participantService = await getTestModuleBuilder(
    );
    */

    mockedStreamerService.reconnectOldStreamer.mockResolvedValue({
      mediaPermissionsToken,
      sendMediaParams: mockedSendMediaParams,
      recvMediaParams: mockedRecvMediaParams,
    });

    mockedViewerService.reconnectOldViewer.mockResolvedValue({
      mediaPermissionsToken,
      recvMediaParams: mockedRecvMediaParams,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handling a joining participant', () => {
    describe('rejoining the user', () => {
      const user_id = 'user0';
      const stream_id = 'stream0';

      const participant = createParticipantFixture({
        id: user_id,
        stream: stream_id,
      });

      beforeAll(() => {
        //mockedParticipantStore.get.mockResolvedValue(participant);
        mockedParticipantStore.get.mockImplementation(async (id: any) => {
          console.log('getting', id);

          return participant;
        });
      });

      it.todo('reactivates previous participant record');
      it('returns only recv params for viewer', () => {
        expect(
          participantService.handleJoiningParticipant(user_id, stream_id),
        ).resolves.toStrictEqual(
          expect.objectContaining({
            recvMediaParams: mockedRecvMediaParams,
            sendMediaParams: undefined,
          }),
        );

        expect(true).toBe(true);
      });
    });
  });
});

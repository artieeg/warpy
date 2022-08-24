import { getMockedInstance } from '@warpy-be/utils';
import { MediaService, ParticipantNodeAssignerStore } from '.';
import { MediaBalancerService, NatsService } from '..';

describe('MediaService', () => {
  const nc = getMockedInstance<NatsService>(NatsService);
  const nodeAssignerStore = getMockedInstance<ParticipantNodeAssignerStore>(
    ParticipantNodeAssignerStore,
  );
  const mediaBalancerService =
    getMockedInstance<MediaBalancerService>(MediaBalancerService);

  const service = new MediaService(
    nodeAssignerStore as any,
    mediaBalancerService as any,
    nc as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const recv = 'recv0';
  const send = 'send0';

  mediaBalancerService.getRecvNodeId.mockResolvedValue(recv);
  mediaBalancerService.getSendNodeId.mockResolvedValue(send);

  describe('getting streamer params', () => {
    it('remembers recv and send nodes', async () => {
      await service.getStreamerParams({
        user: 'user',
        roomId: 'room',
        audio: true,
        video: true,
      });

      expect(nodeAssignerStore.set).toBeCalledWith('user', {
        recv,
        send,
      });
    });
  });

  describe('getting viewer params', () => {
    it('remembers recv node', async () => {
      await service.getViewerParams('user', 'room');

      expect(nodeAssignerStore.set).toBeCalledWith('user', {
        recv,
      });
    });
  });

  describe('creating media room', () => {
    it('requests room creation', async () => {
      await service.createNewRoom({ host: 'test', roomId: 't' });

      expect(nc.request).toBeCalled();
    });
  });
});

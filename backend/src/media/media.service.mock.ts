import { getMockedInstance } from '@warpy-be/utils';
import { MediaService } from './media.service';

export const mockedMediaService = {
  ...getMockedInstance<MediaService>(MediaService),
  createNewRoom: jest.fn().mockResolvedValue({ data: 'test room data' }),
  createSendTransport: jest
    .fn()
    .mockResolvedValue({ data: 'test speaker params' }),
  getViewerParams: jest.fn().mockResolvedValue({ data: 'test viewer params' }),
  getSendNodeId: jest.fn().mockResolvedValue('test-send-node-id'),
  getRecvNodeId: jest.fn().mockResolvedValue('test-recv-node-id'),
  getSendRecvNodeIds: jest.fn().mockResolvedValue({
    sendNodeId: 'test-send-node-id',
    recvNodeId: 'test-recv-node-id',
  }),
  getStreamerPermissions: jest.fn().mockResolvedValue({
    token: 'test-streamer-token',
    permissions: { data: 'test-permissions' },
  }),
  getSpeakerPermissions: jest.fn().mockResolvedValue({
    token: 'test-speaker-token',
    permissions: { data: 'test-permissions' },
  }),
  getViewerPermissions: jest.fn().mockResolvedValue({
    token: 'test-viewer-token',
    permissions: { data: 'test-permissions' },
  }),
  addNewMediaNode: jest.fn(),
  removeUserFromNodes: jest.fn(),
};

/*
export const mockedMediaService: jest.Mocked<Partial<MediaService>> = {
  createNewRoom: jest.fn().mockResolvedValue({ data: 'test room data' }),
  createSendTransport: jest
    .fn()
    .mockResolvedValue({ data: 'test speaker params' }),
  getViewerParams: jest.fn().mockResolvedValue({ data: 'test viewer params' }),
  getSendNodeId: jest.fn().mockResolvedValue('test-send-node-id'),
  getRecvNodeId: jest.fn().mockResolvedValue('test-recv-node-id'),
  getSendRecvNodeIds: jest.fn().mockResolvedValue({
    sendNodeId: 'test-send-node-id',
    recvNodeId: 'test-recv-node-id',
  }),
  getStreamerPermissions: jest.fn().mockResolvedValue({
    token: 'test-streamer-token',
    permissions: { data: 'test-permissions' },
  }),
  getSpeakerPermissions: jest.fn().mockResolvedValue({
    token: 'test-speaker-token',
    permissions: { data: 'test-permissions' },
  }),
  getViewerPermissions: jest.fn().mockResolvedValue({
    token: 'test-viewer-token',
    permissions: { data: 'test-permissions' },
  }),
  addNewMediaNode: jest.fn(),
  removeUserFromNodes: jest.fn(),
};
*/

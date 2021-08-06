import {WebSocket} from 'mock-socket';
global.WebSocket = WebSocket;

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('mediasoup-client');
jest.mock('react-native-modal');
jest.mock('react-native-webrtc', () => ({
  RTCDataChannel: jest.fn(),
}));

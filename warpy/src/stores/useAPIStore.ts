import create from 'zustand';
import {APIClient, WebSocketConn} from '@warpy/api';
import config from '@app/config';

interface IAPIStore {
  api: APIClient;
}

const socket = new WebSocketConn(new WebSocket(config.WS));

export const useAPIStore = create<IAPIStore>((_set, get) => ({
  api: APIClient(socket),
}));

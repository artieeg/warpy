import {GetState, SetState} from 'zustand';
import {APIClient, WebSocketConn} from '@warpy/api';
import config from '@app/config';

export interface IAPISlice {
  api: APIClient;
}

const socket = new WebSocketConn(new WebSocket(config.WS));

export const createAPISlice = (
  _set: SetState<IAPISlice>,
  _get: GetState<IAPISlice>,
) => ({
  api: APIClient(socket),
});

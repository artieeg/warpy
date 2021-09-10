import {GetState, SetState} from 'zustand';
import {APIClient, WebSocketConn} from '@warpy/api';
import config from '@app/config';
import {IStore} from '../useStore';

export interface IAPISlice {
  api: APIClient;
}

const socket = new WebSocketConn(new WebSocket(config.WS));

export const createAPISlice = (
  _set: SetState<IStore>,
  _get: GetState<IStore>,
) => ({
  api: APIClient(socket),
});

import {WebSocketConn} from './connection';

export type APIModule<T = any> = (socket: WebSocketConn) => T;

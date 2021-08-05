import {WebSocketConn} from './connection';

export type APIModule<T = any> = (socket: WebSocketConn) => T;

export type Handler<T = any> = (data: T) => any;
export type EventHandler<T = any> = (handler: Handler<T>) => any;

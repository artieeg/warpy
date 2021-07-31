import React, {createContext, useContext} from 'react';
import {EventEmitter} from 'events';
import config from '@app/config';
import WebSocketConn from '@app/ws';
import {useWebSocketHandler} from '@app/hooks';

type WebSocketEvent =
  | 'new-viewer'
  | 'raise-hand'
  | 'user-left'
  | 'new-speaker'
  | 'viewers'
  | 'room-info'
  | 'created-room'
  | 'speaking-allowed'
  | '@media/recv-connect-params'
  | '@media/new-track'
  | '@media/send-transport-connected'
  | '@media/recv-transport-connected'
  | '@media/send-track-created'
  | '@media/recv-track-created'
  | 'speaker-send-transport'
  | 'recv-tracks-response';

export class ProvidedWebSocket {
  observer = new EventEmitter();
  socket = new WebSocketConn();
  accessToken: string | null = null;

  constructor() {
    this.connect();
  }

  connect = async () => {
    return new Promise<void>(resolve => {
      if (this.socket.isOpen()) {
        return resolve();
      }

      this.socket.onerror = e => {
        console.log('error', e);
      };

      this.socket.onclose = () => {
        this.connect().then(() => this.auth(this.accessToken!));
      };

      this.socket.onopen = () => {
        this.listen();
        resolve();
      };
    });
  };

  off = (event: WebSocketEvent, handler?: any) =>
    this.observer.off(event, handler);

  once = (event: WebSocketEvent, handler: any) =>
    this.observer.once(event, handler);

  on = (event: WebSocketEvent, handler: any) =>
    this.observer.on(event, handler);

  removeAllListeners = () =>
    this.observer
      .eventNames()
      .forEach(event => this.observer.removeAllListeners(event));

  listen = () => {
    this.socket.onmessage = payload => {
      const message = JSON.parse(payload.data);

      const {event, data} = message;
      this.observer.emit(event, data);
    };
  };

  auth = async (token: string) => {
    this.accessToken = token;

    this.socket.send(
      JSON.stringify({
        event: 'auth',
        data: {token},
      }),
    );
  };

  sendStopStream = (data: any) => {
    this.socket.send(
      JSON.stringify({
        event: 'stream-stop',
        data,
      }),
    );
  };

  sendNewTrack = (data: any) => {
    this.socket.send(
      JSON.stringify({
        event: 'new-track',
        data,
      }),
    );
  };

  sendConnectTransport = (data: any, isProducer: boolean = false) => {
    this.socket.send(
      JSON.stringify({
        event: 'connect-transport',
        data: {
          ...data,
          isProducer,
        },
      }),
    );
  };

  sendJoinStream = (stream: string) => {
    console.log('joining stream', stream);
    this.socket.send(
      JSON.stringify({
        event: 'join-stream',
        data: {stream},
      }),
    );
  };

  requestViewers = (stream: string, page: number) => {
    this.socket.send(
      JSON.stringify({
        event: 'request-viewers',
        data: {
          stream,
          page,
        },
      }),
    );
  };

  sendRecvTracksRequest = (data: any) => {
    this.socket.send(
      JSON.stringify({
        event: 'recv-tracks-request',
        data,
      }),
    );
  };

  sendRaiseHand = () => {
    this.socket.send(
      JSON.stringify({
        event: 'raise-hand',
        data: {},
      }),
    );
  };

  sendAllowSpeaker = (speaker: string) => {
    this.socket.send(
      JSON.stringify({
        event: 'speaker-allow',
        data: {
          speaker,
        },
      }),
    );
  };
}

let providedWebSocket = new ProvidedWebSocket();

export const WebSocketContext =
  createContext<ProvidedWebSocket>(providedWebSocket);

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({children}: any) => {
  const context = providedWebSocket;

  useWebSocketHandler(context);

  return (
    <WebSocketContext.Provider value={context}>
      {children}
    </WebSocketContext.Provider>
  );
};

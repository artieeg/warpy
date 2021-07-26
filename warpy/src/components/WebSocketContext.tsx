import React, {createContext, useContext} from 'react';
import {EventEmitter} from 'events';
import config from '@app/config';

type WebSocketEvent =
  | 'new-participant'
  | 'raise-hand'
  | 'allow-speaker'
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

class ProvidedWebSocket {
  observer = new EventEmitter();
  socket = new WebSocket(config.WS);

  constructor() {
    this.connect();
  }

  connect = async () => {
    return new Promise<void>(resolve => {
      if (this.socket.readyState === WebSocket.OPEN) {
        return resolve();
      }

      this.socket.onerror = e => {
        console.log('error', e);
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

  listen = () => {
    this.socket.onmessage = payload => {
      const message = JSON.parse(payload.data);

      const {event, data} = message;
      this.observer.emit(event, data);
    };
  };

  auth = async (token: string) => {
    this.socket.send(
      JSON.stringify({
        event: 'auth',
        data: {token},
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

  sendAllowSpeaker = (stream: string, speaker: string) => {
    this.socket.send(
      JSON.stringify({
        event: 'speaker-allow',
        data: {
          stream,
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

  return (
    <WebSocketContext.Provider value={context}>
      {children}
    </WebSocketContext.Provider>
  );
};

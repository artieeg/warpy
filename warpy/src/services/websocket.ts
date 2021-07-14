import config from '@app/config';

let ws: WebSocket;

type WebSocketEvent =
  | 'user-join'
  | 'raise-hand'
  | 'allow-speaker'
  | 'created-room'
  | 'send-transport-connected'
  | 'recv-transport-connected'
  | 'send-track-created'
  | 'recv-track-created';

type Handler = (data: any) => void;
interface IHandlers {
  [key: string]: Handler;
}

let handlers: IHandlers = {};

export const authSocket = (token: string) => {
  ws.send(
    JSON.stringify({
      event: 'auth',
      data: {token},
    }),
  );
};

export const connectWebSocket = async () => {
  ws = new WebSocket(config.WS);

  return new Promise<void>(resolve => {
    ws.onerror = e => {
      console.log(e);
    };
    ws.onopen = () => {
      listen();
      resolve();
    };
  });
};

const listen = () => {
  ws.onmessage = payload => {
    const message = JSON.parse(payload.data);

    const {event, data} = message;
    console.log('recevied a response', message);
    const handler = handlers[event as WebSocketEvent];

    if (handler) {
      handler(data);
    }
  };
};

export const onWebSocketEvent = (event: WebSocketEvent, handler: any) => {
  handlers[event] = handler;
};

export const sendNewTrack = (data: any) => {
  try {
    ws.send(
      JSON.stringify({
        event: 'new-track',
        data,
      }),
    );
  } catch (e) {
    console.log(e);
  }
};

export const sendConnectTransport = (data: any) => {
  try {
    ws.send(
      JSON.stringify({
        event: 'connect-transport',
        data,
      }),
    );
  } catch (e) {
    console.log(e);
  }
};

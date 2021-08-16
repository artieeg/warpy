import React, {createContext, useContext} from 'react';
import {APIClient, WebSocketConn} from '@warpy/api';
import {useWebSocketHandler} from '@app/hooks';
import config from '@app/config';

const socket = new WebSocketConn(new WebSocket(config.WS));
const client = APIClient(socket);
export const WebSocketContext =
  createContext<ReturnType<typeof APIClient>>(client);

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({children}: any) => {
  useWebSocketHandler(client);

  return (
    <WebSocketContext.Provider value={client}>
      {children}
    </WebSocketContext.Provider>
  );
};

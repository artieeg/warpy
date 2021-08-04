import config from '@app/config';
import {nanoid} from 'nanoid';

export class WebSocketConn {
  socket = new WebSocket(config.WS);
  onmessage?: (message: any) => any;
  onopen?: () => any;
  onclose?: () => any;
  onerror?: (e: any) => any;

  constructor() {
    this.socket.onopen = () => {
      this.onopen && this.onopen();
    };
    this.socket.onclose = () => {
      this.onclose && this.onclose();
    };
    this.socket.onerror = (error: any) => {
      this.onerror && this.onerror(error);
    };
    this.socket.onmessage = (message: any) => {
      this.onmessage && this.onmessage(message);
    };
  }

  isOpen() {
    return this.socket.readyState === WebSocket.OPEN;
  }

  send(message: any) {
    this.socket.send(message);
  }

  request(event: string, data: any) {
    const rid = nanoid();

    const payload = {
      event,
      rid,
      data,
    };

    this.socket.send(JSON.stringify(payload));
  }
}

import { EventEmitter } from "events";
import { nanoid } from "nanoid";

export class WebSocketConn {
  observer = new EventEmitter();
  _socket: any;
  //onmessage?: (message: any) => any;
  onopen?: () => any;
  onclose?: () => any;
  onerror?: (e: any) => any;

  constructor(socket?: any) {
    if (socket) {
      this.socket = socket;
    }
  }

  set socket(instance: any) {
    this._socket = instance;

    this._socket.onopen = () => {
      this.onopen && this.onopen();
    };
    this._socket.onclose = () => {
      console.log("closed");
      this.onclose && this.onclose();
    };
    this._socket.onerror = (error: any) => {
      console.error("Socket Error:", error);
      this.onerror && this.onerror(error);
    };
    this._socket.onmessage = (message: any) => {
      const { event, rid, data } = JSON.parse(message.data);

      this.observer.emit(rid ? rid : event, data);
    };
  }

  send(message: any) {
    this._socket.send(message);
  }

  publish(event: string, data: any) {
    const payload = {
      event,
      data,
    };

    this._socket.send(JSON.stringify(payload));
  }

  request(event: string, data: any) {
    const rid = nanoid();

    const payload = {
      event,
      rid,
      data,
    };

    return new Promise<any>((resolve) => {
      this.observer.once(rid, (response) => resolve(response));
      this._socket.send(JSON.stringify(payload));
    });
  }

  on(event: string, handler: any) {
    this.observer.on(event, handler);

    return () => this.observer.off(event, handler);
  }

  /**
   * Subscribe to the event, fires once
   */
  once(event: string, handler: any) {
    this.observer.once(event, handler);
  }
}

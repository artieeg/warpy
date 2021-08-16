import { EventEmitter } from "events";
import { nanoid } from "nanoid";

export class WebSocketConn {
  observer = new EventEmitter();
  socket: any;
  //onmessage?: (message: any) => any;
  onopen?: () => any;
  onclose?: () => any;
  onerror?: (e: any) => any;

  constructor(socket: any) {
    this.socket = socket;

    this.socket.onopen = () => {
      this.onopen && this.onopen();
    };
    this.socket.onclose = () => {
      console.log("closed");
      this.onclose && this.onclose();
    };
    this.socket.onerror = (error: any) => {
      console.error("Socket Error:", error);
      this.onerror && this.onerror(error);
    };
    this.socket.onmessage = (message: any) => {
      const { event, rid, data } = JSON.parse(message.data);

      this.observer.emit(rid ? rid : event, data);
    };
  }

  send(message: any) {
    this.socket.send(message);
  }

  publish(event: string, data: any) {
    const payload = {
      event,
      data,
    };

    this.socket.send(JSON.stringify(payload));
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
      this.socket.send(JSON.stringify(payload));
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

export type Payload = { [key: string]: any };

export interface IMessage {
  event: string;
  data: Payload[];
  rid?: string;
}

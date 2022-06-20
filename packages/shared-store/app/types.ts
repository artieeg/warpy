import { IStore } from "../useStore";
import { Consumer } from "mediasoup-client/lib/types";

export type StateUpdate = Partial<IStore>;
export type StreamedStateUpdate = AsyncGenerator<StateUpdate>;
export type MediaStreamMap = Record<
  string,
  {
    consumer: Consumer;
    stream: any;
    enabled: boolean;
  }
>;

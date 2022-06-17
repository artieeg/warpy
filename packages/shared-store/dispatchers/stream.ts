import { IParticipant } from "@warpy/lib";
import produce from "immer";
import { StreamService } from "../app/stream";
import { StoreSlice } from "../types";
import { mergeStateUpdate } from "../utils";

export function arrayToMap<T>(array: T[]) {
  const result: Record<string, T> = {};
  array.forEach((item) => {
    result[(item as any).id] = item;
  });

  return result;
}

export interface IStreamDispatchers {
  dispatchStreamCreate: () => Promise<void>;
  dispatchStreamJoin: (stream: string) => Promise<void>;
  dispatchStreamLeave: (config: {
    shouldStopStream: boolean;
    stream: string;
  }) => Promise<void>;
}

export const createStreamDispatchers: StoreSlice<IStreamDispatchers> = (
  set,
  get
) => ({
  async dispatchStreamLeave({ shouldStopStream, stream }) {
    set(
      await mergeStateUpdate(
        new StreamService(get()).leave({ shouldStopStream, stream })
      )
    );
  },

  async dispatchStreamCreate() {
    set(await mergeStateUpdate(new StreamService(get()).create()));
  },

  async dispatchStreamJoin(stream) {
    set(await mergeStateUpdate(new StreamService(get()).join({ stream })));
  },
});

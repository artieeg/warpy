import { StreamService } from "../app/stream";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

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
  _set,
  get
) => ({
  async dispatchStreamLeave({ shouldStopStream, stream }) {
    await runner.mergeStateUpdate(
      new StreamService(get()).leave({ shouldStopStream, stream })
    );
  },

  async dispatchStreamCreate() {
    await runner.mergeStateUpdate(new StreamService(get()).create());
  },

  async dispatchStreamJoin(stream) {
    await runner.mergeStateUpdate(new StreamService(get()).join({ stream }));
  },
});

import { StoreDispatcherSlice } from "../types";

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

export const createStreamDispatchers: StoreDispatcherSlice<IStreamDispatchers> = (
  runner,
  { stream }
) => ({
  async dispatchStreamLeave({ shouldStopStream, stream: streamId }) {
    await runner.mergeStateUpdate(
      stream.leave({ shouldStopStream, stream: streamId })
    );
  },

  async dispatchStreamCreate() {
    await runner.mergeStateUpdate(stream.create());
  },

  async dispatchStreamJoin(streamId) {
    await runner.mergeStateUpdate(stream.join({ stream: streamId }));
  },
});

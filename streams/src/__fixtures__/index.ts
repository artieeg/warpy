import { IStream } from "@app/models";

export const createStreamFixture = (stream: Partial<IStream>) => {
  const fixture = {
    id: "test-stream-id",
    owner: "test-owner-id",
    hub: "test-hub-id",
  };

  return { ...fixture, ...stream };
};

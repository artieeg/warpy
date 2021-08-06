import { Stream } from "@backend/models/stream";
import * as StreamService from "../stream";
import * as nats from "@backend/nats";
import { createStreamFixture } from "@backend/__fixtures__/";
import { AccessDeniedError } from "@backend/errors";

jest.mock("@backend/models/stream");
jest.mock("@backend/nats");

describe("streams service", () => {
  const streamData = {
    owner: "test-owner-id",
    hub: "test-hub-id",
    title: "test title",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates new stream", async () => {
    jest.spyOn(nats, "sendNewStreamEvent").mockResolvedValue(undefined);

    await StreamService.createNewStream(streamData);
    expect(Stream.prototype.save).toBeCalled();
    expect(nats.sendNewStreamEvent).toBeCalled();
  });

  it("stops a stream", async () => {
    jest.spyOn(nats, "sendStreamEndedEvent").mockResolvedValue(undefined);

    const stoppedStreamId = "streamid";

    await StreamService.stopStream(stoppedStreamId);
    expect(Stream.prototype.update).toBeCalled();
    expect(nats.sendStreamEndedEvent).toBeCalledWith(stoppedStreamId);
  });

  it("renames a stream", async () => {
    jest.spyOn(nats, "sendStreamTitleChangeEvent").mockResolvedValue(undefined);
    const id = "streamid";
    const title = "Test new title";
    const streamOwner = "test-stream-owner";
    const user = streamOwner;

    Stream.prototype.updateOne = jest.fn();

    await StreamService.changeStreamTitle({
      id,
      user,
      title,
    });

    expect(nats.sendStreamTitleChangeEvent).toBeCalledWith(id, title);
    expect(Stream.prototype.updateOne).toBeCalled();
  });

  it("checks permission while renaming a stream", async () => {
    const id = "streamid";
    const title = "Test new title";
    const streamOwner = "test-stream-owner";
    const user = "another-test-user";

    Stream.prototype.updateOne = jest.fn().mockRejectedValue(new Error());

    Stream.prototype.find = jest.fn().mockResolvedValue(
      createStreamFixture({
        id,
        owner: streamOwner,
      })
    );

    expect(
      StreamService.changeStreamTitle({
        id,
        user,
        title,
      })
    ).rejects.toEqual(new AccessDeniedError());
  });
});

import { ParticipantDAL, StreamDAL, UserDAL } from "@backend/dal";
import { MediaService } from "@backend/services";
import { createStreamFixture, createUserFixture } from "@backend/__fixtures__";
import { mocked } from "ts-jest/utils";
import { StreamService } from "../index";

describe("StreamService.createNewStream", () => {
  const owner = "test-owner-id";
  const title = "test title";
  const hub = "test hub";

  const consumerNodeId = "test-consumer-node-id";
  const producerNodeId = "test-producer-node-id";

  const streamer = createUserFixture({
    id: owner,
  });

  const stream = createStreamFixture({
    owner,
    hub,
    title,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockedMediaService = mocked(MediaService);
  const mockedUserDAL = mocked(UserDAL);
  const mockedStreamDAL = mocked(StreamDAL);

  beforeAll(() => {
    mockedMediaService.getConsumerNodeId.mockResolvedValue(consumerNodeId);
    mockedMediaService.getProducerNodeId.mockResolvedValue(producerNodeId);
    mockedUserDAL.findById.mockResolvedValue(streamer);
    mockedStreamDAL.createNewStream.mockResolvedValue(stream);
  });

  it("throws if user does not exist", () => {
    mockedUserDAL.findById.mockResolvedValueOnce(null);

    expect(
      StreamService.createNewStream(owner, title, hub)
    ).rejects.toBeTruthy();
  });

  it("throws if there are no consumer/producer nodes", () => {
    mockedMediaService.getConsumerNodeId.mockRejectedValueOnce(new Error());

    expect(
      StreamService.createNewStream(owner, title, hub)
    ).rejects.toBeTruthy();
  });

  it("creates new stream", async () => {
    const response = await StreamService.createNewStream(owner, title, hub);

    expect(MediaService.createRoom).toBeCalledWith(streamer.id, stream.id);
    expect(MediaService.joinRoom).toBeCalledWith(
      consumerNodeId,
      streamer.id,
      stream.id
    );

    expect(ParticipantDAL.createNewParticipant).toBeCalledWith(
      owner,
      response.stream,
      "streamer"
    );

    expect(StreamDAL.createNewStream).toBeCalledWith({
      owner,
      title,
      hub,
      live: true,
    });
  });
});

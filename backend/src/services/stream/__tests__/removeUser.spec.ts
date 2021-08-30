import { StreamService } from "../index";
import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { mocked } from "ts-jest/utils";
import { BroadcastService } from "@backend/services/broadcast";

describe("StreamService.removeUser", () => {
  const mockedParticipantDAL = mocked(ParticipantDAL);
  const mockedStreamDAL = mocked(StreamDAL);
  const mockedBroadcastService = mocked(BroadcastService);
  const user = "user-id";

  it("stops the stream if it exists", async () => {
    const stream = "test-stream";
    mockedParticipantDAL.getCurrentStreamFor.mockResolvedValue(stream);

    await StreamService.removeUser(user);

    expect(mockedStreamDAL.stopStream).toBeCalledWith(stream);
  });

  it("removes user's streams", async () => {
    const stream = "test-stream";
    mockedParticipantDAL.getCurrentStreamFor.mockResolvedValue(stream);

    await StreamService.removeUser(user);

    expect(StreamDAL.removeStreams).toBeCalledWith(user);
  });

  it("broadcasts user leave event", async () => {
    const stream = "test-stream";
    mockedParticipantDAL.getCurrentStreamFor.mockResolvedValue(stream);

    await StreamService.removeUser(user);

    expect(mockedBroadcastService.broadcastParticipantLeft).toBeCalledWith(
      user,
      stream
    );
  });
});

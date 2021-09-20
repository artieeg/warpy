import { ParticipantDAL } from "@backend/dal";
import { MessageService } from "@backend/services";
import { BroadcastService } from "@backend/services/broadcast";
import { createParticipantFixture } from "@backend/__fixtures__";
import { mocked } from "ts-jest/utils";
import { StreamService } from "../index";
import { when } from "jest-when";

describe("StreamService.kickFromStream", () => {
  const userIdKicking = "test-streamer-id";
  const userIdToKick = "test-user-id";
  const recvNodeId = "test-recv-node";
  const sendNodeId = "test-send-node";

  const userKicking = createParticipantFixture({
    id: userIdKicking,
    role: "streamer",
  });

  const userToKick = createParticipantFixture({
    id: userIdToKick,
    recvNodeId,
    sendNodeId,
  });

  const streamParticipants = [
    userKicking,
    userToKick,
    createParticipantFixture({ id: "id1" }),
    createParticipantFixture({ id: "id2" }),
    createParticipantFixture({ id: "id3" }),
  ];

  const streamParticipantIds = streamParticipants.map((p) => p.id);

  const mockedGetById = mocked(ParticipantDAL).getById;

  beforeAll(() => {
    when(mockedGetById)
      .calledWith(userIdKicking)
      .mockResolvedValue(userKicking);

    when(mockedGetById).calledWith(userIdToKick).mockResolvedValue(userToKick);

    mocked(MessageService).kickUser.mockResolvedValue({
      status: "ok",
      user: userIdToKick,
    });

    mocked(ParticipantDAL).getIdsByStream.mockResolvedValue(
      streamParticipantIds
    );
  });

  it.todo("does not try to kick the user if it does not exist", async () => {
    mocked(MessageService).kickUser.mockResolvedValueOnce({
      status: "error",
      user: userIdToKick,
    });

    expect(
      StreamService.kickFromStream({
        user: userIdKicking,
        userToKick: userIdToKick,
      })
    ).rejects.toThrow("Failed to kick from the media nodes");

    expect(mocked(ParticipantDAL).setBanStatus).toBeCalledTimes(0);
  });

  it("does not kick if the user isn't in the same stream", async () => {
    when(mockedGetById)
      .calledWith(userIdToKick)
      .mockResolvedValueOnce(
        createParticipantFixture({
          ...userToKick,
          stream: "different-stream-id",
        })
      );

    expect(
      StreamService.kickFromStream({
        user: userIdKicking,
        userToKick: userIdToKick,
      })
    ).rejects.toThrow("Can't kick this participant");
  });

  it("does not kick if the user does not have the permission", async () => {
    const userWithoutKickPermissions = createParticipantFixture({
      id: userIdKicking,
      role: "speaker",
    });

    mocked(ParticipantDAL).getById.mockResolvedValueOnce(
      userWithoutKickPermissions
    );

    expect(
      StreamService.kickFromStream({
        user: userIdKicking,
        userToKick: userIdToKick,
      })
    ).rejects.toThrow("Permission Error");
  });

  it("requests media server to remote user's media streams", async () => {
    await StreamService.kickFromStream({
      user: userIdKicking,
      userToKick: userIdToKick,
    });

    expect(mocked(MessageService).kickUser).toBeCalledWith(
      recvNodeId,
      userIdToKick
    );
    expect(mocked(MessageService).kickUser).toBeCalledWith(
      sendNodeId,
      userIdToKick
    );
  });

  it.todo(
    "does not proceed with kicking if media servers failed to remove media tracks"
  );

  it("updates isBanned field on the participant model", async () => {
    await StreamService.kickFromStream({
      user: userIdKicking,
      userToKick: userIdToKick,
    });

    expect(mocked(ParticipantDAL).setBanStatus).toBeCalledWith(
      userIdToKick,
      true
    );
  });

  it("broadcasts kicked user to other participants", async () => {
    await StreamService.kickFromStream({
      user: userIdKicking,
      userToKick: userIdToKick,
    });

    expect(mocked(BroadcastService).broadcastKickedUser).toBeCalledWith({
      user: userIdToKick,
      ids: streamParticipantIds,
    });
  });
});

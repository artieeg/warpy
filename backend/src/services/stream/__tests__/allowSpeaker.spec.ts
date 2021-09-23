import { mocked } from "ts-jest/utils";
import { StreamService } from "../index";
import { BlockDAO, ParticipantDAL } from "@backend/dal";
import {
  MessageService,
  MediaService,
  BroadcastService,
} from "@backend/services";
import { createParticipantFixture } from "@backend/__fixtures__";
import { Roles } from "@warpy/lib";
import { BlockedByAnotherSpeaker } from "@backend/errors";

describe("StreamService.allowSpeaker", () => {
  const mockedParticipantDAL = mocked(ParticipantDAL);
  const mockedBroadcastService = mocked(BroadcastService);
  const mockedMediaService = mocked(MediaService);
  const mockedBlockDAO = mocked(BlockDAO);

  const host = createParticipantFixture({ role: "streamer" });
  const viewer = createParticipantFixture({ role: "viewer" });
  const newSpeaker = { ...viewer, role: "speaker" as Roles };
  const stream = "test-stream-id";
  const consumerNodeId = "test-consumer-node-id";
  const producerNodeId = "test-producer-node-id";
  const permissionsToken = "test-permissions-token";

  const existingSpeakerId = "existing-speaker-id";

  const speakers = [
    createParticipantFixture({ id: existingSpeakerId, role: "speaker" }),
  ];

  const testSpeakerMedia = { test: true };

  beforeAll(() => {
    mockedParticipantDAL.getCurrentStreamFor.mockResolvedValue(stream);
    mockedParticipantDAL.getRoleFor.mockResolvedValue(host.role);
    mockedParticipantDAL.makeSpeaker.mockResolvedValue(newSpeaker);
    mockedParticipantDAL.getSpeakers.mockResolvedValue(speakers);
    mockedMediaService.connectSpeakerMedia.mockResolvedValue(
      testSpeakerMedia as any
    );
    mockedMediaService.getConsumerNodeId.mockResolvedValue(consumerNodeId);
    mockedMediaService.getConsumerNodeId.mockResolvedValue(producerNodeId);
    mockedMediaService.createPermissionsToken.mockReturnValue(permissionsToken);
    mockedBlockDAO.getBlockedByIds.mockResolvedValue([]);

    //TODO: mock the whole method
  });

  it("throws if host does not have a stream", () => {
    mockedParticipantDAL.getCurrentStreamFor.mockResolvedValueOnce(null);
    expect(StreamService.allowSpeaker(viewer.id, host.id)).rejects.toBeTruthy();
  });

  it("checks if the user is allowed to give speaker permissions", () => {
    mockedParticipantDAL.getRoleFor.mockResolvedValueOnce("viewer");
    expect(StreamService.allowSpeaker(viewer.id, host.id)).rejects.toBeTruthy();
  });

  it("throws if the new speaker does not exist in the database", () => {
    mockedParticipantDAL.makeSpeaker.mockResolvedValueOnce(null);
    expect(StreamService.allowSpeaker(viewer.id, host.id)).rejects.toBeTruthy();
  });

  it("notifies the user", async () => {
    await StreamService.allowSpeaker(viewer.id, host.id);
    expect(MessageService.sendMessage).toBeCalled();
  });

  it("broadcasts new speaker", async () => {
    await StreamService.allowSpeaker(viewer.id, host.id);

    expect(mockedBroadcastService.broadcastNewSpeaker).toBeCalledWith(
      newSpeaker
    );
  });

  it("does not allow speaking if the user is blocked by one of the speakers", () => {
    mockedBlockDAO.getBlockedByIds.mockResolvedValueOnce([existingSpeakerId]);
    expect(StreamService.allowSpeaker(viewer.id, host.id)).rejects.toEqual(
      new BlockedByAnotherSpeaker({
        last_name: speakers[0].last_name,
        first_name: speakers[0].first_name,
      })
    );
  });
});

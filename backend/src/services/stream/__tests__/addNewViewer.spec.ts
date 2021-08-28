import { ParticipantDAL, UserDAL } from "@backend/dal";
import { MediaService } from "@backend/services";
import { mocked } from "ts-jest/utils";
import {
  createParticipantFixture,
  createRecvTransportParamsFixture,
  createUserFixture,
} from "@backend/__fixtures__";
import { StreamService } from "../index";

describe("StreamService.addNewViewer", () => {
  const stream_id = "test-stream-id";
  const viewer_id = "test-viewer-id";
  const viewer = createUserFixture({ id: viewer_id });
  const participant = createParticipantFixture({ ...viewer });

  const streamer = createParticipantFixture({ role: "streamer" });
  const raisingHand = createParticipantFixture({ isRaisingHand: true });
  const consumerNodeId = "test-node-id";
  const streamViewerCount = 6;
  const recvTransportParams = createRecvTransportParamsFixture({});
  const mediaPermissionsToken = "test-media-token";

  const mockedUserDAL = mocked(UserDAL);
  const mockedParticipantDAL = mocked(ParticipantDAL);
  const mockedMediaService = mocked(MediaService);

  beforeAll(() => {
    mockedUserDAL.findById.mockResolvedValue(viewer);
    mockedMediaService.getConsumerNodeId.mockResolvedValue(consumerNodeId);

    mockedMediaService.createPermissionsToken.mockReturnValue(
      mediaPermissionsToken
    );

    mockedParticipantDAL.createNewParticipant.mockResolvedValue(participant);

    mockedMediaService.joinRoom.mockResolvedValue(recvTransportParams);
    mockedParticipantDAL.count.mockResolvedValue(streamViewerCount);

    mockedParticipantDAL.getSpeakers.mockResolvedValue([streamer]);
    mockedParticipantDAL.getWithRaisedHands.mockResolvedValue([raisingHand]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws if viewer does not exist in the database", () => {
    mockedUserDAL.findById.mockResolvedValueOnce(null);

    expect(
      StreamService.addNewViewer(stream_id, viewer_id)
    ).rejects.toBeTruthy();
  });

  it("adds new viewer", async () => {
    const response = await StreamService.addNewViewer(stream_id, viewer_id);
    expect(MediaService.joinRoom).toBeCalled();

    expect(response.count).toEqual(streamViewerCount);
    expect(response.speakers).toEqual([streamer]);
    expect(response.mediaPermissionsToken).toEqual(mediaPermissionsToken);
    expect(response.recvMediaParams).toEqual(recvTransportParams);
    expect(response.raisedHands).toEqual([raisingHand]);
  });
});

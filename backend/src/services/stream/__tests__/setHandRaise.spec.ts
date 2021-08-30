import { ParticipantDAL } from "@backend/dal";
import { BroadcastService } from "@backend/services/broadcast";
import { createParticipantFixture } from "@backend/__fixtures__";
import { mocked } from "ts-jest/utils";
import { StreamService } from "../index";

describe("Stream.setHandRaise", () => {
  const mockedParticipantDAL = mocked(ParticipantDAL);
  const mockedBroadcastService = mocked(BroadcastService);

  const viewer = createParticipantFixture({});
  const updatedViewer = createParticipantFixture({ ...viewer });

  beforeAll(() => {
    mockedParticipantDAL.setRaiseHand.mockResolvedValue(updatedViewer);
  });

  it("raises hand", async () => {
    await StreamService.setHandRaise(viewer.id, true);
    expect(mockedParticipantDAL.setRaiseHand).toBeCalledWith(viewer.id, true);
  });

  it("lowers hand", async () => {
    await StreamService.setHandRaise(viewer.id, false);
    expect(mockedParticipantDAL.setRaiseHand).toBeCalledWith(viewer.id, false);
  });

  it("broadcasts user info", async () => {
    await StreamService.setHandRaise(viewer.id, false);

    expect(BroadcastService.broadcastRaiseHand).toBeCalledWith(updatedViewer);
  });
});

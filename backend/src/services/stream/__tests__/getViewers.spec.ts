import { ParticipantDAL } from "@backend/dal";
import { createParticipantFixture } from "@backend/__fixtures__";
import { mocked } from "ts-jest/utils";
import { StreamService } from "../index";

describe("StreamService.getViewers", () => {
  const stream = "test-stream-id";
  const page = 0;

  const participants = [
    createParticipantFixture({}),
    createParticipantFixture({}),
    createParticipantFixture({}),
  ];

  const mockedParticipantDAL = mocked(ParticipantDAL);

  it("returns viewers", () => {
    mockedParticipantDAL.getViewersPage.mockResolvedValue(participants);

    expect(StreamService.getViewers(stream, page)).resolves.toEqual({
      viewers: participants,
    });
  });
});

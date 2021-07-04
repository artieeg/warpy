import * as FeedService from "../feed";
import * as StatsCacheService from "../stats_cache";
import * as MessageService from "../message";
import { createCandidateFixture, createUserFixture } from "@app/__fixtures__";
import { Candidate, Participant } from "@app/models";

jest.mock("@app/models");
jest.mock("@app/services/message");

describe("feed service", () => {
  it("handles new candidate", async () => {
    const streamOwnerId = "test-stream-owner";
    const owner = createUserFixture({ id: streamOwnerId });

    jest.spyOn(StatsCacheService, "createStats");
    jest.spyOn(MessageService, "getUser").mockResolvedValue(owner);

    const candidate = createCandidateFixture({ owner: streamOwnerId });
    await FeedService.onNewCandidate(candidate);

    expect(Candidate.prototype.constructor).toBeCalledWith(candidate);
    expect(Candidate.prototype.save).toBeCalled();
    expect(Participant.prototype.constructor).toBeCalledWith({
      ...owner,
      role: "streamer",
    });
    expect(Participant.prototype.save).toBeCalled();

    expect(MessageService.getUser).toBeCalledWith(candidate.owner);
    expect(StatsCacheService.createStats).toBeCalled();
  });
});

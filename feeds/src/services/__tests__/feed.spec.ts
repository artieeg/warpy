import * as FeedService from "../feed";
import * as StatsCacheService from "../stats_cache";
import * as MessageService from "../message";
import {
  createCandidateFixture,
  createStatsFixture,
  createUserFixture,
} from "@app/__fixtures__";
import { Candidate, Participant } from "@app/models";
import { FeedsCacheService } from "..";

jest.mock("@app/models");
jest.mock("@app/services/message");

describe("feed service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds feed", async () => {
    Candidate.prototype.findMany = jest
      .fn()
      .mockResolvedValue([
        createCandidateFixture({ id: "id1" }),
        createCandidateFixture({ id: "id2" }),
        createCandidateFixture({ id: "id3" }),
        createCandidateFixture({ id: "id4" }),
        createCandidateFixture({ id: "id5" }),
      ]);

    //Can be empty for this test
    Participant.prototype.findMany = jest.fn().mockResolvedValue([]);

    jest
      .spyOn(FeedsCacheService, "getServedStreams")
      .mockResolvedValue(["id2", "id4"]);

    jest
      .spyOn(StatsCacheService, "getSortedStreamIds")
      .mockResolvedValue([
        "id2",
        "id4",
        "id5",
        "id1",
        "id3",
        "id6",
        "id9",
        "id8",
      ]);

    const result = await FeedService.getFeed({
      user: "test-user-id",
    });

    expect(result).toBe([
      createCandidateFixture({ id: "id5" }),
      createCandidateFixture({ id: "id1" }),
      createCandidateFixture({ id: "id3" }),
    ]);
  });

  it("handles new candidate", async () => {
    const streamOwnerId = "test-stream-owner";
    const owner = createUserFixture({ id: streamOwnerId });

    jest.spyOn(StatsCacheService, "createStats");
    jest.spyOn(MessageService, "getUser").mockResolvedValue(owner);

    const candidate = createCandidateFixture({ owner: streamOwnerId });
    await FeedService.onNewCandidate(candidate);

    expect(MessageService.getUser).toBeCalledWith(candidate.owner);

    expect(Candidate.prototype.constructor).toBeCalledWith(candidate);
    expect(Candidate.prototype.save).toBeCalled();
    expect(Participant.prototype.constructor).toBeCalledWith({
      ...owner,
      role: "streamer",
    });
    expect(Participant.prototype.save).toBeCalled();

    expect(StatsCacheService.createStats).toBeCalled();
  });
});

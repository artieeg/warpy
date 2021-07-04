import * as FeedService from "../feed";
import * as CandidateStatsService from "../candidate_stats";
import * as MessageService from "../message";
import {
  createCandidateFixture,
  createStreamFixture,
  createParticipantFixture,
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
    Candidate.find = jest
      .fn()
      .mockResolvedValue([
        createCandidateFixture({ id: "id1" }),
        createCandidateFixture({ id: "id2" }),
        createCandidateFixture({ id: "id3" }),
        createCandidateFixture({ id: "id4" }),
        createCandidateFixture({ id: "id5" }),
      ]);

    const participant1 = createParticipantFixture({ stream: "id5" });
    const participant2 = createParticipantFixture({ stream: "id1" });
    const participant3 = createParticipantFixture({ stream: "id3" });

    jest.spyOn(FeedsCacheService, "addServedStreams");

    Participant.find = jest
      .fn()
      .mockResolvedValue([participant1, participant2, participant3]);

    jest
      .spyOn(FeedsCacheService, "getServedStreams")
      .mockResolvedValue(["id2", "id4"]);

    jest
      .spyOn(CandidateStatsService, "getSortedStreamIds")
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

    expect(result).toEqual([
      createStreamFixture({ id: "id5", participants: [participant1] }),
      createStreamFixture({ id: "id1", participants: [participant2] }),
      createStreamFixture({ id: "id3", participants: [participant3] }),
    ]);

    expect(FeedsCacheService.addServedStreams).toBeCalled();
  });

  it("handles new candidate", async () => {
    const streamOwnerId = "test-stream-owner";
    const owner = createUserFixture({ id: streamOwnerId });

    jest.spyOn(CandidateStatsService, "createStats");
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

    expect(CandidateStatsService.createStats).toBeCalled();
  });
});

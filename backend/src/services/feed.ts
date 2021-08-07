import { Candidate, IStream } from "@backend/models";
import {
  FeedsCacheService,
  ParticipantService,
  CandidateStatsService,
} from ".";
import { ICandidate } from "@warpy/lib";

export const getFeed = async (
  user: string,
  hub?: string
): Promise<ICandidate[]> => {
  const servedStreams = await FeedsCacheService.getServedStreams(user);
  const streamIds = await CandidateStatsService.getSortedStreamIds(hub);

  const candidateIds = [];
  for (const id of streamIds) {
    if (!servedStreams.includes(id)) {
      candidateIds.push(id);
    }

    if (candidateIds.length === 3) {
      break;
    }
  }

  const candidates = await Candidate.find({ _id: { $in: candidateIds } });

  const feed = await Promise.all(
    candidateIds
      .map(async (id) => {
        const candidate = candidates.find((c: any) => c.id == id);

        if (!candidate) {
          return null;
        }

        return {
          ...candidate.toJSON(),
          participants: await ParticipantService.getParticipantsCount(id),
        };
      })
      .filter((candidate) => candidate !== null)
  );

  await FeedsCacheService.addServedStreams(user, candidateIds);

  console.log("served feed", feed);

  return feed.filter((item) => item !== null);
};

export const addNewCandidate = async (data: IStream) => {
  const { id, title, hub, owner: ownerId } = data;

  const candidate = new Candidate({
    _id: id,
    title,
    hub,
    owner: ownerId,
  });

  await candidate.save();

  await CandidateStatsService.createStats(candidate.id);
};

export const removeCandidate = async (id: string) => {
  await Candidate.deleteOne({ _id: id });
  await CandidateStatsService.deleteStats(id);
};

export const removeCandidateByOwner = async (user: string) => {
  await Candidate.deleteOne({ owner: user });
};

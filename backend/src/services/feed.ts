import { Candidate, IStream } from "@backend/models";
import { FeedsCacheService, ParticipantService } from ".";
import { ICandidate } from "@warpy/lib";

export const getFeed = async (
  user: string,
  hub?: string
): Promise<ICandidate[]> => {
  const candidates = await Candidate.find();

  console.log("candidates", candidates);

  const feed = Promise.all(
    candidates.map(async (candidate) => ({
      ...candidate,
      participants: await ParticipantService.getParticipantsCount(candidate.id),
    }))
  );

  await FeedsCacheService.addServedStreams(
    user,
    candidates.map((i) => i.id)
  );

  return feed;
};

export const addNewCandidate = async (data: IStream) => {
  const { id, title, hub, owner: ownerId } = data;

  const candidate = Candidate.fromJSON({
    id,
    title,
    hub,
    owner: ownerId,
  });

  await candidate.save();

  //await CandidateStatsService.createStats(candidate.id);
};

export const removeCandidate = async (id: string) => {
  await Candidate.delete(id);
  //await CandidateStatsService.deleteStats(id);
};

export const removeCandidateByOwner = async (user: string) => {
  await Candidate.deleteByOwner(user);
};

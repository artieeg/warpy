import { FeedsCacheService } from ".";
import { ICandidate } from "@warpy/lib";
import { CandidateDAL, IStream, ParticipantDAL } from "@backend/dal";

export const getFeed = async (
  user: string,
  hub?: string
): Promise<ICandidate[]> => {
  const candidates: ICandidate[] = await CandidateDAL.getAll();

  const feed = Promise.all(
    candidates.map(async (candidate) => ({
      ...candidate,
      participants: await ParticipantDAL.count(candidate.id),
      speakers: await ParticipantDAL.getSpeakers(candidate.id),
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

  await CandidateDAL.create({
    id,
    title,
    hub,
    owner: ownerId,
    preview: null,
  });
};

export const removeCandidate = async (id: string) => {
  await CandidateDAL.deleteById(id);
};

export const removeCandidateByOwner = async (user: string) => {
  await CandidateDAL.deleteByOwner(user);
};

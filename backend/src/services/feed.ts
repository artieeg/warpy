import { FeedCacheService } from ".";
import { ICandidate } from "@warpy/lib";
import { CandidateDAL, IStream, ParticipantDAL } from "@backend/dal";

export const FeedService = {
  async getFeed(user: string, hub?: string): Promise<ICandidate[]> {
    const candidates: ICandidate[] = await CandidateDAL.getAll(hub);

    const feed = Promise.all(
      candidates.map(async (candidate) => ({
        ...candidate,
        participants: await ParticipantDAL.count(candidate.id),
        speakers: await ParticipantDAL.getSpeakers(candidate.id),
      }))
    );

    await FeedCacheService.addServedStreams(
      user,
      candidates.map((i) => i.id)
    );

    return feed;
  },
  async addNewCandidate(data: IStream): Promise<void> {
    const { id, title, hub, owner: ownerId } = data;

    await CandidateDAL.create({
      id,
      title,
      hub,
      owner: ownerId,
      preview: null,
    });
  },

  async removeCandidate(id: string): Promise<void> {
    await CandidateDAL.deleteById(id);
  },

  async removeCandidateByOwner(user: string): Promise<void> {
    await CandidateDAL.deleteByOwner(user);
  },
};

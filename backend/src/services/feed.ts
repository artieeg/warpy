import { FeedCacheService } from ".";
import { IStream, ParticipantDAL, StreamDAL } from "@backend/dal";
import { ICandidate } from "@warpy/lib";

export const FeedService = {
  async getFeed(user: string, hub?: string): Promise<ICandidate[]> {
    const candidates: IStream[] = await StreamDAL.getAll();

    const feed = Promise.all(
      candidates.map(
        async (candidate) =>
          ({
            ...candidate,
            participants: await ParticipantDAL.count(candidate.id),
            speakers: await ParticipantDAL.getSpeakers(candidate.id),
          } as ICandidate)
      )
    );

    await FeedCacheService.addServedStreams(
      user,
      candidates.map((i) => i.id)
    );

    return feed;
  },
};

import { Candidate, IStream } from "@app/models";
import {
  FeedsCacheService,
  ParticipantService,
  CandidateStatsService,
  MessageService,
} from ".";
import { MessageHandler } from "@warpy/lib";

interface IGetFeed {
  user: string;
  hub?: string;
}

export const init = () => {
  MessageService.on("user-disconnected", (data: any) => {
    const { user } = data;

    onUserDisconnected(user);
  });
};

export const onFeedRequest: MessageHandler<IGetFeed, any> = async (
  params: IGetFeed,
  respond
) => {
  const { user, hub } = params;

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

  respond!({
    feed: feed.filter((item) => item !== null),
  });
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

export const onRemoveCandidate = async (id: string) => {
  await Candidate.deleteOne({ _id: id });
  await CandidateStatsService.deleteStats(id);
};

export const onUserDisconnected = async (user: string) => {
  await Candidate.deleteOne({ owner: user });
};

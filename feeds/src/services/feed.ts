import { Candidate, Participant } from "@app/models";
import { FeedsCacheService, MessageService, StatsCacheService } from ".";
import mongoose from "mongoose";

interface IGetFeed {
  user: string;
  hub?: string;
}

const getQuery = (hub?: string) => {
  if (hub) {
    return {
      hub: mongoose.Types.ObjectId(hub),
    };
  }

  return {};
};

export const getFeed = async (params: IGetFeed) => {
  const { user, hub } = params;

  const servedStreams = await FeedsCacheService.getServedStreams(user);
  const streamIds = await StatsCacheService.getSortedStreamIds();

  const candidateIds = [];
  for (const id of streamIds) {
    if (!servedStreams.includes(id)) {
      candidateIds.push(id);
    }

    if (candidateIds.length === 3) {
      break;
    }
  }

  const [candidates, participants] = await Promise.all([
    Candidate.find({ id: { $in: candidateIds } }),
    Participant.find({ stream: { $in: candidateIds } }),
  ]);

  //TODO: ugly, change later
  const feed = candidateIds.map((id) => ({
    ...candidates.find((c: any) => c.id == id),
    participants: participants.filter((p: any) => p.stream == id),
  }));

  return feed;
};

export const onNewCandidate = async (data: any) => {
  const { id, title, hub, owner: ownerId } = data;

  const owner = await MessageService.getUser(ownerId);

  const candidate = new Candidate({
    id,
    title,
    hub,
    owner: ownerId,
  });

  const participant = new Participant({
    ...owner,
    role: "streamer",
  });

  await Promise.all([candidate.save(), participant.save()]);

  await StatsCacheService.createStats(candidate.id);
};

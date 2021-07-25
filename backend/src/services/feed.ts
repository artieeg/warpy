import { Candidate, Participant, IParticipant, IStream } from "@app/models";
import { FeedsCacheService, UserService, CandidateStatsService } from ".";
import mongoose from "mongoose";

interface IGetFeed {
  user: string;
  hub?: string;
}

export const getFeed = async (params: IGetFeed) => {
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

  const [candidates, participants] = await Promise.all([
    Candidate.find({ _id: { $in: candidateIds } }),
    Participant.find({ stream: { $in: candidateIds } }),
  ]);

  console.log(candidates);

  //TODO: too ugly, change later
  const feed = candidateIds
    .map((id) => {
      const candidate = candidates.find((c: any) => c.id == id);

      if (!candidate) {
        return null;
      }

      const currentParticipants = participants.filter(
        (p: IParticipant) => p.stream.toString() == id
      );

      return {
        ...candidate.toJSON(),
        participants: currentParticipants,
      };
    })
    .filter((candidate) => candidate !== null);

  await FeedsCacheService.addServedStreams(user, candidateIds);

  return feed;
};

export const onNewCandidate = async (data: IStream) => {
  const { id, title, hub, owner: ownerId } = data;

  const owner = await UserService.getUserById(ownerId.toString());

  const candidate = new Candidate({
    _id: id,
    title,
    hub,
    owner: ownerId,
  });

  const participant = new Participant({
    ...owner,
    stream: id,
    role: "streamer",
  });

  await Promise.all([candidate.save(), participant.save()]);

  await CandidateStatsService.createStats(candidate.id);
};

export const onRemoveCandidate = async (id: string) => {
  await Promise.all([
    Candidate.deleteOne({ _id: id }),
    Participant.deleteMany({ stream: mongoose.Types.ObjectId(id) }),
  ]);

  await CandidateStatsService.deleteStats(id);
};

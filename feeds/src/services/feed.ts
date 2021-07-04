import { Candidate, Participant } from "@app/models";
import { MessageService, StatsCacheService } from ".";

interface IGetFeed {
  user: string;
  hub?: string;
}

export const getFeed = async (params: IGetFeed) => {
  //TODO: implement
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

import { Candidate } from "@app/models";
import { StatsCacheService } from ".";

interface IGetFeed {
  user: string;
  hub: string;
  page: number;
}

export const getUserFeed = (params: IGetFeed) => {
  //TODO: implement
};

export const onNewCandidate = async (data: any) => {
  const { id, title, hub, owner } = data;

  const candidate = new Candidate({
    id,
    title,
    hub,
    owner,
  });

  //TODO: implement
};

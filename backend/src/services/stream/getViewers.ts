import { IRequestViewersResponse } from "@warpy/lib";
import { ParticipantService } from "..";

export const getViewers = async (
  stream: string,
  page: number
): Promise<IRequestViewersResponse> => {
  const viewers = await ParticipantService.getViewersPage(stream, page);

  return {
    viewers: viewers.map((i) => i.toJSON()),
  };
};

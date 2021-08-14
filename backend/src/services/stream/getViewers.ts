import { ParticipantDAL } from "@backend/dal";
import { IRequestViewersResponse } from "@warpy/lib";

export const getViewers = async (
  stream: string,
  page: number
): Promise<IRequestViewersResponse> => {
  const viewers = await ParticipantDAL.getViewersPage(stream, page);

  return {
    viewers,
  };
};

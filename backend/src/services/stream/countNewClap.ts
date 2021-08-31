import { StreamDAL } from "@backend/dal";

export const countNewClap = async (
  _user: string,
  stream: string
): Promise<void> => {
  await StreamDAL.incClapsCount(stream, 1);
};

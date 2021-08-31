import { StreamDAL } from "@backend/dal";

export const stopStream = async (user: string): Promise<void> => {
  await StreamDAL.deleteByUser(user);
};

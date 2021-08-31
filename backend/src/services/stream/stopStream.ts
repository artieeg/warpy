import { StreamDAL } from "@backend/dal";

export const stopStream = async (user: string): Promise<void> => {
  const stream = await StreamDAL.findByOwnerIdLive(user);

  if (!stream) {
    throw new Error();
  }

  await StreamDAL.delete(stream.id);
};

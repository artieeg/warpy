import { ParticipantDAL } from "@backend/dal";

export const kickFromStream = async ({
  user,
  userToKick,
}: {
  user: string;
  userToKick: string;
}) => {
  const participant = await ParticipantDAL.getById(user);

  if (participant?.role !== "streamer") {
    throw new Error("Permission Error");
  }
};

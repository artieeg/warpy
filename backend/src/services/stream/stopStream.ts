import { ParticipantDAL, StreamDAL } from "@backend/dal";

export const stopStream = async (user: string): Promise<void> => {
  const participant = await ParticipantDAL.getById(user);

  if (participant?.stream && participant?.role === "streamer") {
    await StreamDAL.stop(participant.stream);
    await ParticipantDAL.allParticipantsLeave(participant.stream);
  }
};

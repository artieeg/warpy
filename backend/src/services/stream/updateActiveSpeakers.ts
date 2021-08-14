import { ParticipantDAL } from "@backend/dal";
import { IParticipant } from "@warpy/lib";
import { BroadcastService } from "..";

const sendActiveSpeakers = async (speakers: IParticipant[]) => {
  speakers.forEach((speaker) => {
    BroadcastService.broadcastActiveSpeakers(speaker);
  });
};

//TODO: too ugly

export const updateActiveSpeakers = async (speakers: string[]) => {
  const participants = await ParticipantDAL.getByIds(speakers);

  //Split active speakers by stream id; stream-id -> [array of active speakers]
  const streamSpeakersMap: Record<string, IParticipant[]> = {};

  participants.forEach((participant: IParticipant) => {
    if (streamSpeakersMap[participant.stream]) {
      streamSpeakersMap[participant.stream] = [
        ...streamSpeakersMap[participant.stream],
        participant,
      ];
    } else {
      streamSpeakersMap[participant.stream] = [participant];
    }
  });

  for (const stream in streamSpeakersMap) {
    sendActiveSpeakers(streamSpeakersMap[stream]);
  }
};

import { ParticipantDAL } from "@backend/dal";
import { IParticipant } from "@warpy/lib";
import { BroadcastService } from "..";

const sendActiveSpeakers = async (speakers: unknown[]): Promise<void> => {
  speakers.forEach((speaker) => {
    BroadcastService.broadcastActiveSpeakers(speaker as IParticipant);
  });
};

//TODO: too ugly

export const updateActiveSpeakers = async (
  speakers: Record<string, number>
): Promise<void> => {
  const participants = await ParticipantDAL.getByIds(Object.keys(speakers));
  console.log("active speakers", speakers);

  //Split active speakers by stream id; stream-id -> [array of active speakers]
  const streamSpeakersMap: Record<string, unknown[]> = {};

  participants.forEach((participant: IParticipant) => {
    if (!participant.stream) {
      return;
    }

    if (streamSpeakersMap[participant.stream]) {
      streamSpeakersMap[participant.stream] = [
        ...streamSpeakersMap[participant.stream],
        {
          ...participant,
          volume: speakers[participant.id],
        },
      ];
    } else {
      streamSpeakersMap[participant.stream] = [
        {
          ...participant,
          volume: speakers[participant.id],
        },
      ];
    }
  });

  for (const stream in streamSpeakersMap) {
    sendActiveSpeakers(streamSpeakersMap[stream]);
  }
};

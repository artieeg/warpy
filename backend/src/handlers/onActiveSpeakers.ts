import { Participant } from "@backend/models";
import { ParticipantService } from "@backend/services";
import { IActiveSpeakersPayload, MessageHandler } from "@warpy/lib";

const sendActiveSpeakers = async (stream: string, speakers: Participant[]) => {
  const participants = await Participant.getByStream(stream);
  console.log("stream", stream);

  const ids = participants.map((p) => p.user.id);

  console.log("ids", ids);
  console.log("speakers", speakers);
  speakers.forEach((speaker) => {
    ParticipantService.broadcastActiveSpeaker(speaker.toJSON(), ids);
  });
};

export const onActiveSpeakers: MessageHandler<IActiveSpeakersPayload> = async (
  data
) => {
  const { speakers } = data;

  const participants = await Participant.getByIds(speakers);

  const streamSpeakersMap: Record<string, Participant[]> = {};

  participants.forEach((participant: Participant) => {
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
    sendActiveSpeakers(stream, streamSpeakersMap[stream]);
  }
};

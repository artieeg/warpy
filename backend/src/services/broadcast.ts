import { ParticipantDAL } from "@backend/dal";
import { IParticipant } from "@warpy/lib";
import { MessageService } from ".";

const getParticipantIds = (participants: IParticipant[]) => {
  return participants.map((p) => p.id);
};

export const broadcastNewSpeaker = async (speaker: IParticipant) => {
  const { stream } = speaker;

  const users = await ParticipantDAL.getParticipantsByStream(stream);

  await MessageService.sendMessageBroadcast(getParticipantIds(users), {
    event: "new-speaker",
    data: {
      speaker,
      stream,
    },
  });
};

export const broadcastRaiseHand = async (viewer: IParticipant) => {
  const { stream } = viewer;

  const users = await ParticipantDAL.getParticipantsByStream(stream);

  await MessageService.sendMessageBroadcast(getParticipantIds(users), {
    event: "raise-hand",
    data: {
      viewer,
      stream,
    },
  });
};

export const broadcastParticipantLeft = async (
  user: string,
  stream: string
) => {
  const users = await ParticipantDAL.getParticipantsByStream(stream);

  await MessageService.sendMessageBroadcast(getParticipantIds(users), {
    event: "user-left",
    data: {
      user,
      stream,
    },
  });
};

export const broadcastNewViewer = async (viewer: IParticipant) => {
  const { stream } = viewer;
  console.log("viewerw", viewer);
  const users = await ParticipantDAL.getParticipantsByStream(stream);
  console.log("other users", users);

  await MessageService.sendMessageBroadcast(getParticipantIds(users), {
    event: "new-viewer",
    data: {
      stream,
      viewer,
    },
  });
};

export const broadcastActiveSpeakers = async (speaker: IParticipant) => {
  const users = await ParticipantDAL.getParticipantsByStream(speaker.stream);

  await MessageService.sendMessageBroadcast(getParticipantIds(users), {
    event: "active-speaker",
    data: {
      stream: speaker.stream,
      speaker,
    },
  });
};

import { ParticipantDAL } from "@backend/dal";
import { IParticipant } from "@warpy/lib";
import { MessageService } from "./message";

const getParticipantIds = (participants: IParticipant[]) => {
  return participants.map((p) => p.id);
};

export const BroadcastService = {
  async broadcastNewSpeaker(speaker: IParticipant): Promise<void> {
    const { stream } = speaker;

    const users = await ParticipantDAL.getParticipantsByStream(stream);

    await MessageService.sendMessageBroadcast(getParticipantIds(users), {
      event: "new-speaker",
      data: {
        speaker,
        stream,
      },
    });
  },

  async broadcastRaiseHand(viewer: IParticipant): Promise<void> {
    const { stream } = viewer;

    const users = await ParticipantDAL.getParticipantsByStream(stream);

    await MessageService.sendMessageBroadcast(getParticipantIds(users), {
      event: "raise-hand",
      data: {
        viewer,
        stream,
      },
    });
  },

  async broadcastParticipantLeft(user: string, stream: string): Promise<void> {
    const users = await ParticipantDAL.getParticipantsByStream(stream);

    await MessageService.sendMessageBroadcast(getParticipantIds(users), {
      event: "user-left",
      data: {
        user,
        stream,
      },
    });
  },

  async broadcastNewViewer(viewer: IParticipant): Promise<void> {
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
  },

  async broadcastActiveSpeakers(speaker: IParticipant): Promise<void> {
    const users = await ParticipantDAL.getParticipantsByStream(speaker.stream);

    await MessageService.sendMessageBroadcast(getParticipantIds(users), {
      event: "active-speaker",
      data: {
        stream: speaker.stream,
        speaker,
      },
    });
  },
};

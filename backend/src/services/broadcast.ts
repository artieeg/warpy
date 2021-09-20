import { ParticipantDAL } from "@backend/dal";
import { IChatMessage, IParticipant, Reaction } from "@warpy/lib";
import { MessageService } from "./message";

export const BroadcastService = {
  getParticipantIds(participants: IParticipant[]): string[] {
    return participants.map((p) => p.id);
  },

  async broadcastNewSpeaker(speaker: IParticipant): Promise<void> {
    const { stream } = speaker;

    if (!stream) {
      return;
    }

    const users = await ParticipantDAL.getByStream(stream);

    await MessageService.sendMessageBroadcast(
      BroadcastService.getParticipantIds(users),
      {
        event: "new-speaker",
        data: {
          speaker,
          stream,
        },
      }
    );
  },

  async broadcastRaiseHand(viewer: IParticipant): Promise<void> {
    const { stream } = viewer;

    if (!stream) {
      return;
    }

    const users = await ParticipantDAL.getByStream(stream);

    await MessageService.sendMessageBroadcast(
      BroadcastService.getParticipantIds(users),
      {
        event: "raise-hand",
        data: {
          viewer,
          stream,
        },
      }
    );
  },

  async broadcastParticipantLeft(user: string, stream: string): Promise<void> {
    const users = await ParticipantDAL.getByStream(stream);

    await MessageService.sendMessageBroadcast(
      BroadcastService.getParticipantIds(users),
      {
        event: "user-left",
        data: {
          user,
          stream,
        },
      }
    );
  },

  async broadcastNewViewer(viewer: IParticipant): Promise<void> {
    const { stream } = viewer;

    if (!stream) {
      return;
    }

    const users = await ParticipantDAL.getByStream(stream);

    await MessageService.sendMessageBroadcast(
      BroadcastService.getParticipantIds(users),
      {
        event: "new-viewer",
        data: {
          stream,
          viewer,
        },
      }
    );
  },

  async broadcastActiveSpeakers(speaker: IParticipant): Promise<void> {
    const { stream } = speaker;

    if (!stream) {
      return;
    }

    const users = await ParticipantDAL.getByStream(stream);

    await MessageService.sendMessageBroadcast(
      BroadcastService.getParticipantIds(users),
      {
        event: "active-speaker",
        data: {
          stream: speaker.stream,
          speaker,
        },
      }
    );
  },

  async broadcastReactions(params: {
    stream: string;
    reactions: Reaction[];
  }): Promise<void> {
    const { stream, reactions } = params;

    const users = await ParticipantDAL.getByStream(stream);
    const ids = BroadcastService.getParticipantIds(users);

    MessageService.sendMessageBroadcast(ids, {
      event: "reactions-update",
      data: {
        stream,
        reactions,
      },
    });
  },

  async broadcastNewMessage(params: {
    message: IChatMessage;
    targetUserIds: string[];
  }) {
    const { message, targetUserIds } = params;

    MessageService.sendMessageBroadcast(targetUserIds, {
      event: "chat-message",
      data: {
        message,
      },
    });
  },

  async broadcastKickedUser({ user, ids }: { user: string; ids: string[] }) {},
};

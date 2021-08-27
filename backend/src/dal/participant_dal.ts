import { IParticipant, Roles } from "@warpy/lib";
import { prisma } from "./client";
import { Participant, User } from "@prisma/client";
import { toUserDTO } from "./user_dal";

export const toParticipantDTO = (
  data: (Participant & { user?: User }) | null
): IParticipant => {
  if (!data) {
    throw new Error("Participant is null");
  }

  if (!data.user) {
    throw new Error("Participant's user data is null");
  }

  return {
    ...toUserDTO(data.user, false),
    stream: data.stream_id,
    role: data.role as Roles,
    isRaisingHand: data.isRaisingHand,
  };
};

export const ParticipantDAL = {
  createNewParticipant: async (
    user_id: string,
    stream: string,
    role: Roles = "viewer"
  ): Promise<IParticipant> => {
    const data = await prisma.participant.create({
      data: {
        stream_id: stream,
        role,
        isRaisingHand: false,
        user_id: user_id,
      },
      include: {
        user: true,
      },
    });

    return toParticipantDTO(data);
  },

  getByIds: async (ids: string[]): Promise<IParticipant[]> => {
    const data = await prisma.participant.findMany({
      where: { user_id: { in: ids } },
      include: {
        user: true,
      },
    });

    return data.map(toParticipantDTO);
  },

  makeSpeaker: async (user: string): Promise<IParticipant> => {
    const speaker = await prisma.participant.update({
      where: { user_id: user },
      data: {
        isRaisingHand: false,
        role: "speaker",
      },
      include: {
        user: true,
      },
    });

    return toParticipantDTO(speaker);
  },

  getById: async (user: string): Promise<IParticipant> => {
    const participant = await prisma.participant.findUnique({
      where: { user_id: user },
      include: { user: true },
    });

    return toParticipantDTO(participant);
  },

  deleteParticipant: async (id: string): Promise<IParticipant> => {
    const result = await prisma.participant.delete({
      where: { user_id: id },
      include: {
        user: true,
      },
    });

    return toParticipantDTO(result);
  },

  getParticipantsByStream: async (
    streamId: string
  ): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: { stream_id: streamId },
      include: { user: true },
    });

    return participants.map(toParticipantDTO);
  },

  async deleteParticipantsByStream(stream: string): Promise<void> {
    prisma.participant.deleteMany({
      where: { stream_id: stream },
    });
  },

  async getCurrentStreamFor(user: string): Promise<string | null> {
    const result = await prisma.participant.findUnique({
      where: { user_id: user },
      select: { stream_id: true },
    });

    return result?.stream_id || null;
  },

  async setCurrentStreamFor(user: string, stream: string): Promise<void> {
    await prisma.participant.update({
      where: { user_id: user },
      data: {
        stream_id: stream,
      },
    });
  },

  async getRoleFor(user: string, stream: string): Promise<string | null> {
    const result = await prisma.participant.findUnique({
      where: { stream_participant_index: { user_id: user, stream_id: stream } },
      select: { role: true },
    });

    return result?.role || null;
  },

  getSpeakers: async (stream: string): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: { stream_id: stream, role: { in: ["speaker", "streamer"] } },
      include: {
        user: true,
      },
    });

    return participants.map(toParticipantDTO);
  },

  getViewersPage: async (
    stream: string,
    page: number
  ): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      include: { user: true },
      where: { stream_id: stream, role: "viewer" },
      skip: 50 * page,
      take: 50,
    });

    return participants.map(toParticipantDTO);
  },

  count: async (stream: string): Promise<number> => {
    return prisma.participant.count({
      where: { stream_id: stream },
    });
  },

  getWithRaisedHands: async (stream: string): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: { stream_id: stream, isRaisingHand: true, role: "viewer" },
      include: {
        user: true,
      },
    });

    return participants.map(toParticipantDTO);
  },

  setRaiseHand: async (user: string, flag: boolean): Promise<IParticipant> => {
    const participant = await prisma.participant.update({
      where: { user_id: user },
      data: {
        isRaisingHand: flag,
      },
      include: {
        user: true,
      },
    });

    return toParticipantDTO(participant);
  },
};

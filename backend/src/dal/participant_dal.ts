import { IParticipant, Roles } from "@warpy/lib";
import { prisma } from "./client";
import { toUserDTO } from "./user_dal";

export const toParticipantDTO = (data: any): IParticipant => {
  return {
    ...toUserDTO(data.user, false),
    stream: data.stream,
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
        stream,
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

  setParticipantRole: async (
    user: string,
    role: Roles
  ): Promise<IParticipant> => {
    const participant = await prisma.participant.update({
      where: { id: user },
      data: {
        role,
      },
    });

    return toParticipantDTO(participant);
  },

  deleteParticipant: async (id: string): Promise<IParticipant> => {
    const result = await prisma.participant.delete({
      where: { user_id: id },
    });

    return toParticipantDTO(result);
  },

  getParticipantsByStream: async (
    streamId: string
  ): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: { stream: streamId },
      include: { user: true },
    });

    return participants.map(toParticipantDTO);
  },

  deleteParticipantsByStream: async (stream: string) => {
    prisma.participant.deleteMany({
      where: { stream },
    });
  },

  getCurrentStreamFor: async (user: string): Promise<string | null> => {
    const result = await prisma.participant.findUnique({
      where: { user_id: user },
      select: { stream: true },
    });

    return result?.stream || null;
  },

  setCurrentStreamFor: async (user: string, stream: string) => {
    await prisma.participant.update({
      where: { user_id: user },
      data: {
        stream,
      },
    });
  },

  getRoleFor: async (user: string, stream: string): Promise<string | null> => {
    const result = await prisma.participant.findUnique({
      where: { stream_participant_index: { user_id: user, stream: stream } },
      select: { role: true },
    });

    return result?.role || null;
  },

  getSpeakers: async (stream: string): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: { stream },
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
      where: { stream, role: "viewer" },
      skip: 50 * page,
      take: 50,
    });

    return participants.map(toParticipantDTO);
  },

  count: async (stream: string): Promise<number> => {
    return prisma.participant.count({
      where: { stream },
    });
  },

  getWithRaisedHands: async (stream: string): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: { stream, isRaisingHand: true, role: "viewer" },
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
    });

    return toParticipantDTO(participant);
  },
};

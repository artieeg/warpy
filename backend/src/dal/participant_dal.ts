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

  setParticipantRole: async (user: string, role: Roles) => {
    const participant = await prisma.participant.update({
      where: { id: user },
      data: {
        role,
      },
    });

    return toParticipantDTO(participant);
  },

  deleteParticipant: async (id: string) => {
    const result = await prisma.participant.delete({
      where: { id },
    });

    return toParticipantDTO(result);
  },

  getParticipantsByStream: async (streamId: string) => {
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

  getCurrentStreamFor: async (user: string) => {
    const result = await prisma.participant.findUnique({
      where: { user_id: user },
      select: { stream: true },
    });

    return result?.stream || null;
  },

  setCurrentStreamFor: async (user: string, stream: string) => {
    const result = await prisma.participant.update({
      where: { user_id: user },
      data: {
        stream,
      },
    });

    return result;
  },

  getRoleFor: async (user: string, stream: string) => {
    const result = await prisma.participant.findUnique({
      where: { stream_participant_index: { user_id: user, stream: stream } },
      select: { role: true },
    });

    return result?.role || null;
  },

  getSpeakers: async (stream: string) => {
    const participants = await prisma.participant.findMany({
      where: { stream },
      include: {
        user: true,
      },
    });

    return participants.map(toParticipantDTO);
  },

  getViewersPage: async (stream: string, page: number) => {
    const participants = await prisma.participant.findMany({
      include: { user: true },
      where: { stream, role: "viewer" },
      skip: 50 * page,
      take: 50,
    });

    return participants.map(toParticipantDTO);
  },

  count: async (stream: string) => {
    return prisma.participant.count({
      where: { stream },
    });
  },

  getWithRaisedHands: async (stream: string) => {
    const participants = await prisma.participant.findMany({
      where: { stream, isRaisingHand: true, role: "viewer" },
      include: {
        user: true,
      },
    });

    return participants.map(toParticipantDTO);
  },

  setRaiseHand: async (user: string, flag: boolean) => {
    const participant = await prisma.participant.update({
      where: { user_id: user },
      data: {
        isRaisingHand: flag,
      },
    });

    return participant;
  },
};

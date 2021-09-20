import { IParticipant, Roles } from "@warpy/lib";
import { prisma } from "./client";
import { Participant, User } from "@prisma/client";
import { toUserDTO } from "./user_dal";

type CreateNewParticipant = {
  user_id: string;
  role?: Roles;
  stream?: string;
};

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
  create: async ({
    user_id,
    role,
    stream,
  }: CreateNewParticipant): Promise<IParticipant> => {
    const data = await prisma.participant.create({
      data: {
        stream_id: stream,
        role: role || "viewer",
        isRaisingHand: false,
        user_id: user_id,
        id: user_id,
      },
      include: {
        user: true,
      },
    });

    return toParticipantDTO(data);
  },

  async setStream(user_id: string, stream: string): Promise<void> {
    await prisma.participant.update({
      where: { user_id },
      data: {
        stream: {
          connect: {
            id: stream,
          },
        },
      },
    });
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

  makeSpeaker: async (user: string): Promise<IParticipant | null> => {
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

    if (!speaker) {
      return null;
    }

    return toParticipantDTO(speaker);
  },

  getById: async (user: string): Promise<IParticipant | null> => {
    const participant = await prisma.participant.findUnique({
      where: { user_id: user },
      include: { user: true },
    });

    if (!participant) {
      return null;
    }

    return toParticipantDTO(participant);
  },

  deleteParticipant: async (id: string): Promise<void> => {
    await prisma.participant.delete({
      where: { user_id: id },
    });
  },

  getIdsByStream: async (streamId: string): Promise<string[]> => {
    const result = await prisma.participant.findMany({
      where: { stream_id: streamId },
      select: { id: true },
    });

    return result.map((r) => r.id);
  },

  getByStream: async (streamId: string): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: { stream_id: streamId },
      include: { user: true },
    });

    return participants.map(toParticipantDTO);
  },

  async setBanStatus(user: string, isBanned: boolean): Promise<void> {
    await prisma.participant.update({
      where: { id: user },
      data: {
        isBanned,
      },
    });
  },

  async updateOne(user: string, data: Partial<Participant>): Promise<void> {
    await prisma.participant.update({
      where: {
        id: user
      },
      data
    })
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
      where: {
        stream_id: stream,
        isBanned: false,
        role: { in: ["speaker", "streamer"] },
        hasLeftStream: false
      },
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
      where: {
        stream_id: stream,
        role: "viewer",
        isBanned: false,
        hasLeftStream: false,
      },
      skip: 50 * page,
      take: 50,
    });

    return participants.map(toParticipantDTO);
  },

  count: async (stream: string): Promise<number> => {
    return prisma.participant.count({
      where: { stream_id: stream, isBanned: false, hasLeftStream: false },
    });
  },

  getWithRaisedHands: async (stream: string): Promise<IParticipant[]> => {
    const participants = await prisma.participant.findMany({
      where: {
        stream_id: stream,
        isBanned: false,
        hasLeftStream: false
        isRaisingHand: true,
        role: "viewer",
      },
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

import { IParticipant, Roles } from "@warpy/lib";
import { prisma, runPrismaQuery } from "./client";
import { Participant, User } from "@prisma/client";
import { toUserDTO } from "./user_dal";

type CreateNewParticipant = {
  user_id: string;
  role?: Roles;
  stream?: string;
  recvNodeId: string;
};

interface IFullParticipant extends IParticipant {
  recvNodeId: string;
  sendNodeId: string | null;
  isBanned: boolean;
  hasLeftStream: boolean;
}

export const toParticipantClientDTO = (
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

export const toFullParticipantDTO = (
  data: (Participant & { user?: User }) | null
): IFullParticipant => {
  if (!data) {
    throw new Error("Participant is null");
  }

  return {
    ...toParticipantClientDTO(data),
    recvNodeId: data.recvNodeId,
    sendNodeId: data.sendNodeId,
    isBanned: data.isBanned,
    hasLeftStream: data.hasLeftStream,
  };
};

export const ParticipantDAL = {
  async create({
    user_id,
    role,
    stream,
    recvNodeId,
  }: CreateNewParticipant): Promise<IFullParticipant> {
    const data = await runPrismaQuery(() =>
      prisma.participant.create({
        data: {
          stream_id: stream,
          role: role || "viewer",
          isRaisingHand: false,
          user_id: user_id,
          //id: user_id,
          recvNodeId,
        },
        include: {
          user: true,
        },
      })
    );

    return toFullParticipantDTO(data);
  },

  async getByIdAndStream(
    user_id: string,
    stream: string
  ): Promise<IFullParticipant> {
    const data = await runPrismaQuery(() =>
      prisma.participant.findFirst({
        where: {
          user_id: user_id,
          stream_id: stream,
        },
        include: {
          user: true,
        },
      })
    );

    return toFullParticipantDTO(data);
  },

  async allParticipantsLeave(stream: string): Promise<void> {
    await runPrismaQuery(() =>
      prisma.participant.updateMany({
        where: {
          stream_id: stream,
        },
        data: {
          left_at: new Date(),
          hasLeftStream: true,
        },
      })
    );
  },

  async setStream(user_id: string, stream: string): Promise<void> {
    await runPrismaQuery(() =>
      prisma.participant.update({
        where: { user_id },
        data: {
          stream: {
            connect: {
              id: stream,
            },
          },
        },
      })
    );
  },

  getByIds: async (ids: string[]): Promise<IParticipant[]> => {
    const data = await runPrismaQuery(() =>
      prisma.participant.findMany({
        where: { user_id: { in: ids } },
        include: {
          user: true,
        },
      })
    );

    return data.map(toParticipantClientDTO);
  },

  makeSpeaker: async (user: string): Promise<IParticipant | null> => {
    const speaker = await runPrismaQuery(() =>
      prisma.participant.update({
        where: { user_id: user },
        data: {
          isRaisingHand: false,
          role: "speaker",
        },
        include: {
          user: true,
        },
      })
    );

    if (!speaker) {
      return null;
    }

    return toParticipantClientDTO(speaker);
  },

  getById: async (user: string): Promise<IFullParticipant | null> => {
    const participant = await runPrismaQuery(() =>
      prisma.participant.findUnique({
        where: { user_id: user },
        include: { user: true },
      })
    );

    if (!participant) {
      return null;
    }

    return toFullParticipantDTO(participant);
  },

  deleteParticipant: async (id: string): Promise<void> => {
    await runPrismaQuery(() =>
      prisma.participant.delete({
        where: { user_id: id },
      })
    );
  },

  getIdsByStream: async (streamId: string): Promise<string[]> => {
    const result = await runPrismaQuery(() =>
      prisma.participant.findMany({
        where: { stream_id: streamId },
        select: { user_id: true },
      })
    );

    return result.map((r) => r.user_id);
  },

  getByStream: async (streamId: string): Promise<IParticipant[]> => {
    const participants = await runPrismaQuery(() =>
      prisma.participant.findMany({
        where: { stream_id: streamId },
        include: { user: true },
      })
    );

    return participants.map(toParticipantClientDTO);
  },

  async setBanStatus(user: string, isBanned: boolean): Promise<void> {
    await runPrismaQuery(() =>
      prisma.participant.update({
        where: { user_id: user },
        data: {
          isBanned,
          ...(isBanned && {
            hasLeftStream: true,
            left_at: new Date(),
          }),
        },
      })
    );
  },

  async updateOne(
    user: string,
    data: Partial<Participant>
  ): Promise<IFullParticipant> {
    const updated = await runPrismaQuery(() =>
      prisma.participant.update({
        where: {
          user_id: user,
        },
        include: {
          user: true,
        },
        data,
      })
    );

    return toFullParticipantDTO(updated);
  },

  async deleteParticipantsByStream(stream: string): Promise<void> {
    await runPrismaQuery(() =>
      prisma.participant.deleteMany({
        where: { stream_id: stream },
      })
    );
  },

  async getCurrentStreamFor(user: string): Promise<string | null> {
    const result = await runPrismaQuery(() =>
      prisma.participant.findUnique({
        where: { user_id: user },
        select: { stream_id: true },
      })
    );

    return result?.stream_id || null;
  },

  async setCurrentStreamFor(user: string, stream: string): Promise<void> {
    await runPrismaQuery(() =>
      prisma.participant.update({
        where: { user_id: user },
        data: {
          stream_id: stream,
        },
      })
    );
  },

  async getRoleFor(user: string, stream: string): Promise<string | null> {
    const result = await runPrismaQuery(() =>
      prisma.participant.findUnique({
        where: {
          stream_participant_index: {
            user_id: user,
            stream_id: stream,
            hasLeftStream: false,
          },
        },
        select: { role: true },
      })
    );

    return result?.role || null;
  },

  getSpeakers: async (stream: string): Promise<IParticipant[]> => {
    const participants = await runPrismaQuery(() =>
      prisma.participant.findMany({
        where: {
          stream_id: stream,
          isBanned: false,
          role: { in: ["speaker", "streamer"] },
          hasLeftStream: false,
        },
        include: {
          user: true,
        },
      })
    );

    return participants.map(toParticipantClientDTO);
  },

  getViewersPage: async (
    stream: string,
    page: number
  ): Promise<IParticipant[]> => {
    const participants = await runPrismaQuery(() =>
      prisma.participant.findMany({
        include: { user: true },
        where: {
          stream_id: stream,
          role: "viewer",
          isBanned: false,
          hasLeftStream: false,
        },
        skip: 50 * page,
        take: 50,
      })
    );

    return participants.map(toParticipantClientDTO);
  },

  count: async (stream: string): Promise<number> => {
    return runPrismaQuery(() =>
      prisma.participant.count({
        where: { stream_id: stream, isBanned: false, hasLeftStream: false },
      })
    );
  },

  getWithRaisedHands: async (stream: string): Promise<IParticipant[]> => {
    const participants = await runPrismaQuery(() =>
      prisma.participant.findMany({
        where: {
          stream_id: stream,
          isBanned: false,
          hasLeftStream: false,
          isRaisingHand: true,
          role: "viewer",
        },
        include: {
          user: true,
        },
      })
    );

    return participants.map(toParticipantClientDTO);
  },

  setRaiseHand: async (user: string, flag: boolean): Promise<IParticipant> => {
    const participant = await runPrismaQuery(() =>
      prisma.participant.update({
        where: { user_id: user },
        data: {
          isRaisingHand: flag,
        },
        include: {
          user: true,
        },
      })
    );

    return toParticipantClientDTO(participant);
  },
};

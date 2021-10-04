import { Injectable } from '@nestjs/common';
import { Participant, User } from '@prisma/client';
import { IParticipant, Roles } from '@warpy/lib';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../user/user.entity';

export type CreateNewParticipant = {
  user_id: string;
  role?: Roles;
  stream?: string;
  recvNodeId: string;
  sendNodeId?: string;
};

export interface IFullParticipant extends IParticipant {
  recvNodeId: string;
  sendNodeId: string | null;
  isBanned: boolean;
  hasLeftStream: boolean;
}

@Injectable()
export class ParticipantEntity {
  constructor(private prisma: PrismaService) {}

  static toParticipantClientDTO(
    data: (Participant & { user?: User }) | null,
  ): IParticipant {
    if (!data) {
      throw new Error('Participant is null');
    }

    if (!data.user) {
      throw new Error("Participant's user data is null");
    }

    return {
      ...UserEntity.toUserDTO(data.user, false),
      stream: data.stream_id,
      role: data.role as Roles,
      isRaisingHand: data.isRaisingHand,
    };
  }

  static toFullParticipantDTO(
    data: (Participant & { user?: User }) | null,
  ): IFullParticipant {
    if (!data) {
      throw new Error('Participant is null');
    }

    return {
      ...this.toParticipantClientDTO(data),
      recvNodeId: data.recvNodeId,
      sendNodeId: data.sendNodeId,
      isBanned: data.isBanned,
      hasLeftStream: data.hasLeftStream,
    };
  }

  async create({
    user_id,
    role,
    stream,
    recvNodeId,
  }: CreateNewParticipant): Promise<IFullParticipant> {
    const data = await this.prisma.participant.create({
      data: {
        stream_id: stream,
        role: role || 'viewer',
        isRaisingHand: false,
        user_id: user_id,
        //id: user_id,
        recvNodeId,
      },
      include: {
        user: true,
      },
    });

    return ParticipantEntity.toFullParticipantDTO(data);
  }

  async getByIdAndStream(
    user_id: string,
    stream: string,
  ): Promise<IFullParticipant> {
    const data = await this.prisma.participant.findFirst({
      where: {
        user_id: user_id,
        stream_id: stream,
      },
      include: {
        user: true,
      },
    });

    return ParticipantEntity.toFullParticipantDTO(data);
  }

  async allParticipantsLeave(stream: string): Promise<void> {
    await this.prisma.participant.updateMany({
      where: {
        stream_id: stream,
      },
      data: {
        left_at: new Date(),
        hasLeftStream: true,
      },
    });
  }

  async updateOne(
    user_id: string,
    data: Partial<Participant>,
  ): Promise<IParticipant> {
    const participant = await this.prisma.participant.update({
      where: {
        user_id,
      },
      include: {
        user: true,
      },
      data,
    });

    return ParticipantEntity.toParticipantClientDTO(participant);
  }

  async setStream(user_id: string, stream: string): Promise<void> {
    await this.prisma.participant.update({
      where: { user_id },
      data: {
        stream: {
          connect: {
            id: stream,
          },
        },
      },
    });
  }

  async getByIds(ids: string[]): Promise<IParticipant[]> {
    const data = await this.prisma.participant.findMany({
      where: { user_id: { in: ids } },
      include: {
        user: true,
      },
    });

    return data.map(ParticipantEntity.toParticipantClientDTO);
  }

  async makeSpeaker(user: string): Promise<IFullParticipant | null> {
    const speaker = await this.prisma.participant.update({
      where: { user_id: user },
      data: {
        isRaisingHand: false,
        role: 'speaker',
      },
      include: {
        user: true,
      },
    });

    if (!speaker) {
      return null;
    }

    return ParticipantEntity.toFullParticipantDTO(speaker);
  }

  async getById(user: string): Promise<IFullParticipant | null> {
    const participant = await this.prisma.participant.findUnique({
      where: { user_id: user },
      include: { user: true },
    });

    if (!participant) {
      return null;
    }

    return ParticipantEntity.toFullParticipantDTO(participant);
  }

  async deleteParticipant(id: string): Promise<void> {
    await this.prisma.participant.delete({
      where: { user_id: id },
    });
  }

  async getIdsByStream(streamId: string): Promise<string[]> {
    const result = await this.prisma.participant.findMany({
      where: { stream_id: streamId },
      select: { user_id: true },
    });

    return result.map((r) => r.user_id);
  }

  async getByStream(streamId: string): Promise<IParticipant[]> {
    const participants = await this.prisma.participant.findMany({
      where: { stream_id: streamId },
      include: { user: true },
    });

    return participants.map(ParticipantEntity.toParticipantClientDTO);
  }

  async setBanStatus(user: string, isBanned: boolean): Promise<void> {
    await this.prisma.participant.update({
      where: { user_id: user },
      data: {
        isBanned,
        ...(isBanned && {
          hasLeftStream: true,
          left_at: new Date(),
        }),
      },
    });
  }

  async deleteParticipantsByStream(stream: string): Promise<void> {
    await this.prisma.participant.deleteMany({
      where: { stream_id: stream },
    });
  }

  async getCurrentStreamFor(user: string): Promise<string | null> {
    const result = await this.prisma.participant.findUnique({
      where: { user_id: user },
      select: { stream_id: true },
    });

    return result?.stream_id || null;
  }

  async setCurrentStreamFor(user: string, stream: string): Promise<void> {
    await this.prisma.participant.update({
      where: { user_id: user },
      data: {
        stream_id: stream,
      },
    });
  }

  async getRoleFor(user: string, stream: string): Promise<string | null> {
    const result = await this.prisma.participant.findUnique({
      where: {
        stream_participant_index: {
          user_id: user,
          stream_id: stream,
          hasLeftStream: false,
        },
      },
      select: { role: true },
    });

    return result?.role || null;
  }

  async getSpeakers(stream: string): Promise<IParticipant[]> {
    const participants = await this.prisma.participant.findMany({
      where: {
        stream_id: stream,
        isBanned: false,
        role: { in: ['speaker', 'streamer'] },
        hasLeftStream: false,
      },
      include: {
        user: true,
      },
    });

    return participants.map(ParticipantEntity.toParticipantClientDTO);
  }

  async getViewersPage(stream: string, page: number): Promise<IParticipant[]> {
    const participants = await this.prisma.participant.findMany({
      include: { user: true },
      where: {
        stream_id: stream,
        role: 'viewer',
        isBanned: false,
        hasLeftStream: false,
      },
      skip: 50 * page,
      take: 50,
    });

    return participants.map(ParticipantEntity.toParticipantClientDTO);
  }

  async count(stream: string): Promise<number> {
    return this.prisma.participant.count({
      where: { stream_id: stream, isBanned: false, hasLeftStream: false },
    });
  }

  async getWithRaisedHands(stream: string): Promise<IParticipant[]> {
    const participants = await this.prisma.participant.findMany({
      where: {
        stream_id: stream,
        isBanned: false,
        hasLeftStream: false,
        isRaisingHand: true,
        role: 'viewer',
      },
      include: {
        user: true,
      },
    });

    return participants.map(ParticipantEntity.toParticipantClientDTO);
  }

  async setRaiseHand(user: string, flag: boolean): Promise<IParticipant> {
    const participant = await this.prisma.participant.update({
      where: { user_id: user },
      data: {
        isRaisingHand: flag,
      },
      include: {
        user: true,
      },
    });

    return ParticipantEntity.toParticipantClientDTO(participant);
  }
}

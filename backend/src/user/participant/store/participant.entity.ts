import { Injectable, OnModuleInit } from '@nestjs/common';
import { IParticipant, Roles } from '@warpy/lib';
import { ConfigService } from '@nestjs/config';
import IORedis, { Pipeline } from 'ioredis';

export type CreateNewParticipant = {
  user_id?: string;
  bot_id?: string;
  role?: Roles;
  stream?: string;
  recvNodeId: string;
  sendNodeId?: string;
};

export interface IFullParticipant extends IParticipant {
  recvNodeId: string;
  sendNodeId: string | null;
  isBanned: boolean;
}

const PREFIX_ALL = 'all_';
const PREFIX_STREAMERS = 'streamers_';
const PREFIX_RAISED_HANDS = 'raised_hands_';
const PREFIX_COUNT = 'count_';

@Injectable()
export class ParticipantStore implements OnModuleInit {
  redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.configService.get('participantStoreAddr'));
  }

  private toDTO(data: any): IFullParticipant {
    return {
      ...data,
      isBot: data.isBot === 'true',
      isBanned: data.isBanned === 'true',
    };
  }

  private getInstanceFromArray(items: any[]): IFullParticipant {
    let record: IFullParticipant;

    for (let i = 0; i < items.length; i += 2) {
      record[items[i]] = items[i + 1];
    }

    return record;
  }

  private async list(ids: string[]): Promise<IFullParticipant[]> {
    const pipe = this.redis.pipeline();

    for (const id of ids) {
      pipe.hgetall(id);
    }

    const data = await pipe.exec();
    return data
      .map(([, items]) => {
        if (!items) {
          return null;
        }

        return this.getInstanceFromArray(items);
      })
      .filter((item) => !!item);
  }

  /**
   * Returns info about audio/video streamers
   * */
  async getStreamers(stream: string) {
    const ids = await this.redis.smembers(PREFIX_STREAMERS + stream);

    return this.list(ids);
  }

  /**
   * Returns info about participants with raised hands
   * */
  async getRaisedHands(stream: string) {
    const ids = await this.redis.smembers(PREFIX_RAISED_HANDS + stream);

    return this.list(ids);
  }

  async count(stream: string) {
    const v = await this.redis.get(PREFIX_COUNT + stream);

    return v ? Number.parseInt(v) : 0;
  }

  private async write(
    key: string,
    data: Partial<IFullParticipant>,
    pipeline?: Pipeline,
  ) {
    const args: string[] = [];
    for (const key in data) {
      args.push(key, data[key]);
    }

    return (pipeline || this.redis).hmset(key, ...args);
  }

  async update(id: string, data: Partial<IFullParticipant>) {
    return this.write(id, data);
  }

  async add(data: IFullParticipant) {
    const { stream } = data;

    const pipe = this.redis.pipeline();
    pipe.sadd(PREFIX_ALL + stream);
    pipe.incr(PREFIX_COUNT + stream);
    this.write(data.id, data, pipe);

    await pipe.exec();
  }
}

/*
@Injectable()
export class ParticipantStore {
  constructor(private prisma: PrismaService) {}

  static toParticipantClientDTO(
    data:
      | (Participant & {
          user?: User;
          bot?: BotInstance & { bot?: Bot };
          videoEnabled?: boolean;
          audioEnabled?: boolean;
        })
      | null,
  ): IParticipant {
    if (!data) {
      throw new Error('Participant is null');
    }

    if (!data.user && !data.bot) {
      throw new Error("Participant's user data is null");
    }

    let user = data.user
      ? UserEntity.toUserDTO(data.user, false)
      : BotInstanceEntity.toBotInstanceDTO({
          ...data.bot,
          id: data.bot_id,
        });

    return {
      ...user,
      stream: data.stream_id,
      role: data.role as Roles,
      isRaisingHand: data.isRaisingHand,
      audioEnabled: data.audioEnabled,
      videoEnabled: data.videoEnabled,
      isBot: !!data.bot?.bot,
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
    bot_id,
    role,
    stream,
    recvNodeId,
    audioEnabled,
    videoEnabled,
  }: CreateNewParticipant): Promise<IFullParticipant> {
    const data = await this.prisma.participant.create({
      data: {
        stream_id: stream,
        role: role || 'viewer',
        isRaisingHand: false,
        user_id,
        bot_id,
        audioEnabled,
        videoEnabled,
        recvNodeId,
      },
      include: {
        user: true,
        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    return ParticipantStore.toFullParticipantDTO(data);
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
        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    return ParticipantStore.toFullParticipantDTO(data);
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
        bot: {
          include: {
            bot: true,
          },
        },
      },
      data,
    });

    return ParticipantStore.toParticipantClientDTO(participant);
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

  async getByIds(
    ids: string[],
    include: {
      stream: boolean;
    },
  ): Promise<IParticipant[]> {
    const data = await this.prisma.participant.findMany({
      where: { user_id: { in: ids } },
      include: {
        user: true,
        bot: {
          include: {
            bot: true,
          },
        },
        ...include,
      },
    });

    return data.map(ParticipantStore.toParticipantClientDTO);
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
        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    if (!speaker) {
      return null;
    }

    return ParticipantStore.toFullParticipantDTO(speaker);
  }

  async getById(user: string): Promise<IFullParticipant | null> {
    const isBot = user.slice(0, 3) === 'bot';

    const participant = await this.prisma.participant.findUnique({
      where: isBot ? { bot_id: user } : { user_id: user },
      include: {
        user: true,

        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    if (!participant) {
      return null;
    }

    return ParticipantStore.toFullParticipantDTO(participant);
  }

  async deleteParticipant(id: string): Promise<void> {
    const isBot = id.slice(0, 3) === 'bot';

    await this.prisma.participant.delete({
      where: isBot ? { bot_id: id } : { user_id: id },
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
      include: {
        user: true,

        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    return participants.map(ParticipantStore.toParticipantClientDTO);
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
    const result = await this.prisma.participant.findFirst({
      where: { user_id: user, hasLeftStream: false },
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
        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    return participants.map(ParticipantStore.toParticipantClientDTO);
  }

  async getViewersPage(stream: string, page: number): Promise<IParticipant[]> {
    const participants = await this.prisma.participant.findMany({
      include: {
        user: true,
        bot: {
          include: {
            bot: true,
          },
        },
      },
      where: {
        stream_id: stream,
        role: 'viewer',
        isBanned: false,
        hasLeftStream: false,
      },
      skip: 50 * page,
      take: 50,
    });

    return participants.map(ParticipantStore.toParticipantClientDTO);
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
        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    return participants.map(ParticipantStore.toParticipantClientDTO);
  }

  async setRaiseHand(user: string, flag: boolean): Promise<IParticipant> {
    const participant = await this.prisma.participant.update({
      where: { user_id: user },
      data: {
        isRaisingHand: flag,
      },
      include: {
        user: true,
        bot: {
          include: {
            bot: true,
          },
        },
      },
    });

    return ParticipantStore.toParticipantClientDTO(participant);
  }

  async countUsersWithVideoEnabled(stream: string) {
    const count = await this.prisma.participant.count({
      where: {
        stream_id: stream,
        videoEnabled: true,
      },
    });

    return count;
  }
}
*/

import { User } from '@warpy/lib';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import cuid from 'cuid';

export type NewUserParams = Omit<PrismaUser, 'id' | 'created_at'>;

export function toUserDTO(data: PrismaUser, includeDetails?: boolean) {
  return {
    id: data.id,
    last_name: data.last_name,
    first_name: data.first_name,
    username: data.username,
    bio: data.bio,
    avatar: data.avatar,
    sub: includeDetails ? data.sub : null,
    email: includeDetails ? data.email : null,
    isAnon: data.is_anon,
  };
}

export class UserStore {
  constructor(private prisma: PrismaClient) {}

  async update(user: string, data: Partial<User>) {
    await this.prisma.user.update({
      where: {
        id: user,
      },
      data,
    });
  }

  async createAnonUser(): Promise<string> {
    const { id } = await this.prisma.user.create({
      data: {
        id: `user_anon_${cuid()}`,
        is_anon: true,
      },
      select: {
        id: true,
      },
    });

    return id;
  }

  async createUser(data: NewUserParams): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });

    return toUserDTO(user);
  }

  async search(textToSearch: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: textToSearch,
              mode: 'insensitive',
            },
          },
          {
            last_name: {
              contains: textToSearch,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: textToSearch,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return users.map((user) => toUserDTO(user));
  }

  async find(id: string, details = false): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? toUserDTO(user, details) : null;
  }

  async del(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findMany(ids: string[]): Promise<User[]> {
    const data = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return data.map((user) => toUserDTO(user, false));
  }
}

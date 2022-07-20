import { IUser } from '@warpy/lib';
import { PrismaClient, User } from '@prisma/client';
import cuid from 'cuid';

export type NewUserParams = Omit<User, 'id' | 'created_at'>;

export interface IUserStore {
  update: (user: string, update: Partial<User>) => Promise<void>;
  createUser: (data: NewUserParams) => Promise<IUser>;
  createAnonUser: () => Promise<string>;
  search: (textToSearch: string) => Promise<IUser[]>;
  find: (id: string, includeDetails?: boolean) => Promise<IUser | null>;
  del: (id: string) => Promise<void>;
  findMany: (ids: string[]) => Promise<IUser[]>;
}

export function toUserDTO(data: User, includeDetails?: boolean) {
  return {
    id: data.id,
    last_name: data.last_name,
    first_name: data.first_name,
    username: data.username,
    avatar: data.avatar,
    sub: includeDetails ? data.sub : null,
    email: includeDetails ? data.email : null,
    isAnon: data.is_anon,
  };
}

export class UserStore implements IUserStore {
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

  async createUser(data: NewUserParams): Promise<IUser> {
    const user = await this.prisma.user.create({
      data,
    });

    return toUserDTO(user);
  }

  async search(textToSearch: string): Promise<IUser[]> {
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

  async find(id: string, details = false): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? toUserDTO(user, details) : null;
  }

  async del(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findMany(ids: string[]): Promise<IUser[]> {
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

import { Injectable } from '@nestjs/common';
import { Bot, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IUser } from '@warpy/lib';
import cuid from 'cuid';

type NewUserParams = Omit<User, 'id' | 'created_at'>;

@Injectable()
export class UserEntity {
  constructor(private prisma: PrismaService) {}

  static toUserDTO(data: User, includeDetails = false): IUser {
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

  async createNewUser(data: NewUserParams): Promise<IUser> {
    const user = await this.prisma.user.create({
      data,
    });

    return UserEntity.toUserDTO(user);
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

    return users.map((user) => UserEntity.toUserDTO(user));
  }

  async findById(id: string, details = false): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? UserEntity.toUserDTO(user, details) : null;
  }

  async delete(id: string): Promise<IUser | null> {
    const user = await this.prisma.user.delete({ where: { id } });

    return user ? UserEntity.toUserDTO(user) : null;
  }
}

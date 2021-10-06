import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IUser } from '@warpy/lib';

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
    };
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

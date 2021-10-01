import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@backend_2/prisma/prisma.service';
import { IUser } from '@warpy/lib';

type NewUserParams = Omit<Omit<User, 'id'>, 'created_at'>;

@Injectable()
export class UserEntity {
  constructor(private prisma: PrismaService) {}

  toUserDTO(data: User, includeDetails = false): IUser {
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

  async createNewUser(data: NewUserParams): Promise<User> {
    const user = this.prisma.user.create({
      data,
    });

    return user;
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

    return users.map((user) => this.toUserDTO(user));
  }

  async findById(id: string, details = false): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toUserDTO(user, details) : null;
  }

  async delete(id: string): Promise<IUser | null> {
    const user = await this.prisma.user.delete({ where: { id } });

    return user ? this.toUserDTO(user) : null;
  }
}

import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WaitlistEntity {
  constructor(private prisma: PrismaService) {}

  async check(
    email: string,
    username: string,
  ): Promise<'email' | 'username' | 'none'> {
    const record = await this.prisma.waitlistRecord.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (!record) {
      return 'none';
    }

    if (record.username === username) {
      return 'username';
    }

    if (record.email === email) {
      return 'email';
    }
  }

  async del(email: string) {
    await this.prisma.waitlistRecord.delete({
      where: { email },
    });
  }

  async add(email: string, username: string) {
    await this.prisma.waitlistRecord.create({
      data: {
        email,
        username,
      },
    });
  }
}

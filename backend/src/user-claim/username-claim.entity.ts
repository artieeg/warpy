import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsernameClaimEntity {
  constructor(private prismaService: PrismaService) {}

  async create({
    username,
    phone,
    hash: ip_hash,
  }: {
    username: string;
    phone: string;
    hash: number;
  }) {
    await this.prismaService.usernameClaim.create({
      data: {
        ip_hash,
        username,
        phone,
      },
    });
  }
}

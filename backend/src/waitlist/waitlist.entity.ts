import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WaitlistEntity {
  constructor(private prisma: PrismaService) {}

  async add(email: string, username: string) {}
}

import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WaitlistEntity {
  constructor(private prisma: PrismaService) {}

  //async exists(email: string): Promise<boolean> {}

  async add(email: string, username: string) {}
}

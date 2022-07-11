import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BotInstanceStore } from 'lib/stores';

@Injectable()
export class NjsBotInstanceStore extends BotInstanceStore {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }
}

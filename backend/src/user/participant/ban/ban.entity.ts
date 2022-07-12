import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { StreamBanStore } from 'lib/stores/stream-bans';

@Injectable()
export class NjsStreamBanStore extends StreamBanStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

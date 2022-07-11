import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { StreamStoreImpl } from 'lib/stores/stream';

@Injectable()
export class StreamStore extends StreamStoreImpl {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { StreamStore } from './stream.entity';

@Module({
  imports: [PrismaModule],
  providers: [StreamStore],
  exports: [StreamStore],
})
export class StreamCommonModule {}

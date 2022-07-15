import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { NjsStreamStore } from './stream.entity';

@Module({
  imports: [PrismaModule],
  providers: [NjsStreamStore],
  exports: [NjsStreamStore],
})
export class StreamCommonModule {}

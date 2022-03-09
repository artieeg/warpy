import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { StreamEntity } from './stream.entity';

@Module({
  imports: [PrismaModule],
  providers: [StreamEntity],
  exports: [StreamEntity],
})
export class StreamCommonModule {}

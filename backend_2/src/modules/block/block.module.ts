import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockEntity } from './block.entity';

@Module({
  imports: [PrismaModule],
  providers: [BlockEntity],
  exports: [BlockEntity],
})
export class BlockModule {}

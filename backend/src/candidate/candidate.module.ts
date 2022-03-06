import { Module } from '@nestjs/common';
import { StreamModule } from '../stream/stream.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { BlockModule } from '@backend_2/user/block/block.module';
import { UserModule } from '@backend_2/user/user.module';

@Module({
  imports: [PrismaModule, BlockModule, StreamModule, UserModule],
  providers: [CandidateService],
  controllers: [CandidateController],
})
export class CandidateModule {}

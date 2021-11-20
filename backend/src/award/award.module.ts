import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AwardModelEntity } from './award-model.entity';
import { AwardController } from './award.controller';
import { AwardService } from './award.service';

@Module({
  imports: [PrismaModule],
  providers: [AwardService, AwardModelEntity],
  controllers: [AwardController],
  exports: [],
})
export class AwardModule {}

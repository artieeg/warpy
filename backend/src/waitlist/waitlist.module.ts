import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { WaitlistEntity } from './waitlist.entity';
import { WaitlistService } from './waitlist.service';

@Module({
  imports: [PrismaModule],
  providers: [WaitlistEntity, WaitlistService],
  controllers: [],
  exports: [],
})
export class WaitlistModule {}

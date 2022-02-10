import { MailModule } from '@backend_2/mail/mail.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { TokenModule } from '@backend_2/token/token.module';
import { Module } from '@nestjs/common';
import { WaitlistController } from './waitlist.controller';
import { WaitlistEntity } from './waitlist.entity';
import { WaitlistService } from './waitlist.service';

@Module({
  imports: [PrismaModule, MailModule, TokenModule],
  providers: [WaitlistEntity, WaitlistService],
  controllers: [WaitlistController],
  exports: [],
})
export class WaitlistModule {}

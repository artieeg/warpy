import { MailModule } from '@warpy-be/mail/mail.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { TokenModule } from '@warpy-be/token/token.module';
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

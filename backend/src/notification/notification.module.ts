import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [PrismaModule, MessageModule],
  providers: [NotificationEntity, NotificationService],
  controllers: [NotificationController],
  exports: [],
})
export class NotificationModule {}

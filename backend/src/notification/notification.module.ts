import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MessageModule } from '../message/message.module';
import { StreamModule } from '@backend_2/stream/stream.module';

@Module({
  imports: [PrismaModule, StreamModule, MessageModule],
  providers: [NotificationEntity, NotificationService],
  controllers: [NotificationController],
  exports: [],
})
export class NotificationModule {}

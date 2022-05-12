import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { StreamModule } from '@warpy-be/stream/stream.module';
import { NotificationStore } from './notification.store';

@Module({
  imports: [PrismaModule],
  providers: [NotificationEntity, NotificationStore, NotificationService],
  controllers: [NotificationController],
  exports: [],
})
export class NotificationModule {}

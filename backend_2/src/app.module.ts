import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { StreamBlockModule } from './modules/stream-block/stream-block.module';
import { StreamModule } from './modules/stream/stream.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    StreamModule,
    StreamBlockModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

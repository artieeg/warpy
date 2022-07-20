import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { TimerModule } from './shared/modules/timer/timer.module';
import * as modules from './modules';

export const appModuleImports = [
  ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }),
  TimerModule,

  ...Object.values(modules).filter((m) => m.name.includes('Module')),

  EventEmitterModule.forRoot(),
];

@Module({
  imports: appModuleImports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

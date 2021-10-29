import { Module } from '@nestjs/common';
import { BotsModule } from './bots/bots.module';

@Module({
  imports: [BotsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

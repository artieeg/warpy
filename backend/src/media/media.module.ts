import { Module } from '@nestjs/common';
import { NatsModule } from '../nats/nats.module';
import { MediaBalancerModule } from './media-balancer/media-balancer.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [NatsModule, MediaBalancerModule],
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}

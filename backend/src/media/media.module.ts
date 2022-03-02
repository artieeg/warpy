import { Module } from '@nestjs/common';
import { NatsModule } from '../nats/nats.module';
import { MediaBalancerModule } from './media-balancer/media-balancer.module';
import { MediaService } from './media.service';

@Module({
  imports: [NatsModule, MediaBalancerModule],
  providers: [MediaService],
  exports: [MediaService],
  controllers: [],
})
export class MediaModule {}

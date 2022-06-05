import { Module } from '@nestjs/common';
import { NatsModule } from '../nats/nats.module';
import { MediaBalancerModule } from './media-balancer/media-balancer.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ParticipantNodeAssignerModule } from './participant-node-assigner/participant-node-assigner.module';

@Module({
  imports: [NatsModule, MediaBalancerModule, ParticipantNodeAssignerModule],
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}

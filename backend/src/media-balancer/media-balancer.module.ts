import { Module } from '@nestjs/common';
import { MediaBalancerController } from './media-balancer.controller';
import { MediaBalancerService } from './media-balancer.service';

@Module({
  imports: [],
  providers: [MediaBalancerService],
  controllers: [MediaBalancerController],
  exports: [],
})
export class MediaBalancerModule {}

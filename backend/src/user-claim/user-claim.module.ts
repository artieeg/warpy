import { Module } from '@nestjs/common';
import { UserClaimController } from './user-claim.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [UserClaimController],
  exports: [],
})
export class UserClaimModule {}

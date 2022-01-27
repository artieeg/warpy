import { Module } from '@nestjs/common';
import { UserClaimController } from './user-claim.controller';
import { UserClaimService } from './user-claim.service';
import { UsernameClaimEntity } from './username-claim.entity';

@Module({
  imports: [],
  providers: [UsernameClaimEntity, UserClaimService],
  controllers: [UserClaimController],
  exports: [],
})
export class UserClaimModule {}

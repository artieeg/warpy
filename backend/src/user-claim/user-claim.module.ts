import {PrismaModule} from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserClaimController } from './user-claim.controller';
import { UserClaimService } from './user-claim.service';
import { UsernameClaimEntity } from './username-claim.entity';

@Module({
  imports: [PrismaModule],
  providers: [UsernameClaimEntity, UserClaimService],
  controllers: [UserClaimController],
  exports: [],
})
export class UserClaimModule {}

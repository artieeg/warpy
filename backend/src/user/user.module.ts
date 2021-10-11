import { Module } from '@nestjs/common';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenModule } from '../token/token.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, TokenModule, ParticipantModule],
  controllers: [UserController],
  providers: [UserEntity, UserService],
  exports: [UserEntity, UserService],
})
export class UserModule {}
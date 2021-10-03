import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserEntity, UserService],
  exports: [UserEntity, UserService],
})
export class UserModule {}

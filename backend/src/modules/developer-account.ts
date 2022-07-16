import { Injectable, Module } from '@nestjs/common';
import { DeveloperAccountStore } from 'lib';
import { PrismaModule } from '.';

@Injectable()
export class NjsDeveloperAccountStore extends DeveloperAccountStore {}

@Module({
  imports: [PrismaModule],
  providers: [NjsDeveloperAccountStore],
  controllers: [],
  exports: [NjsDeveloperAccountStore],
})
export class DeveloperAccountModule {}

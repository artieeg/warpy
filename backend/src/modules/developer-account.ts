import { Injectable, Module } from '@nestjs/common';
import { DeveloperAccountStore } from '@warpy-be/app';
import { PrismaService, PrismaModule } from './prisma';

@Injectable()
export class NjsDeveloperAccountStore extends DeveloperAccountStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Module({
  imports: [PrismaModule],
  providers: [NjsDeveloperAccountStore],
  controllers: [],
  exports: [NjsDeveloperAccountStore],
})
export class DeveloperAccountModule {}

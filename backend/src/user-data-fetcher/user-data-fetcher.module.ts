import { Module } from '@nestjs/common';
import { StreamModule } from '@warpy-be/stream/stream.module';
import { UserModule } from '@warpy-be/user/user.module';
import { UserDataFetcherController } from './user-data-fetcher.controller';
import { UserDataFetcherService } from './user-data-fetcher.service';

@Module({
  imports: [UserModule, StreamModule],
  providers: [UserDataFetcherService],
  controllers: [UserDataFetcherController],
  exports: [],
})
export class UserDataFetcherModule {}

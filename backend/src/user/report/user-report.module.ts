import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { NjsUserReportStore } from './user-report.entity';
import { NjsUserReportService } from './user-report.service';

@Module({
  imports: [PrismaModule],
  providers: [NjsUserReportService, NjsUserReportStore],
  controllers: [UserReportController],
})
export class UserReportModule {}

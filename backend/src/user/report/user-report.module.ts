import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { UserReportEntity } from './user-report.entity';
import { UserReportService } from './user-report.service';

@Module({
  imports: [PrismaModule],
  providers: [UserReportService, UserReportEntity],
  controllers: [UserReportController],
})
export class UserReportModule {}

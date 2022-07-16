import { Injectable, Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserReportService, UserReportStore } from 'lib';
import { PrismaModule } from '.';
import { IUserReportRequest, IUserReportResponse } from '@warpy/lib';

@Injectable()
export class NjsUserReportService extends UserReportService {}

@Injectable()
export class NjsUserReportStore extends UserReportStore {}

@Controller()
export class UserReportController {
  constructor(private userReportService: NjsUserReportService) {}

  @MessagePattern('user.report')
  async onUserReport({
    reportedUserId,
    reportReasonId,
    user,
  }: IUserReportRequest): Promise<IUserReportResponse> {
    await this.userReportService.addUserReport(
      reportedUserId,
      user,
      reportReasonId,
    );

    return {
      reportedUser: reportedUserId,
    };
  }
}

@Module({
  imports: [PrismaModule],
  providers: [NjsUserReportService, NjsUserReportStore],
  controllers: [UserReportController],
})
export class UserReportModule {}

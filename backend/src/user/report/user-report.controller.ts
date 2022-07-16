import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IUserReportRequest, IUserReportResponse } from '@warpy/lib';
import { NjsUserReportService } from './user-report.service';

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

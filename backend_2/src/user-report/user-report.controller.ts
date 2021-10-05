import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IUserReportRequest, IUserReportResponse } from '../../../lib';
import { UserReportService } from './user-report.service';

@Controller()
export class UserReportController {
  constructor(private userReportService: UserReportService) {}

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

import { Injectable } from '@nestjs/common';
import { UserReportEntity } from './user-report.entity';

@Injectable()
export class UserReportService {
  constructor(private userReportEntity: UserReportEntity) {}

  async addUserReport(
    reported: string,
    reporter: string,
    reportReasonId: string,
  ) {
    await this.userReportEntity.create({
      reportee: reporter,
      reported,
      reason: reportReasonId,
    });
  }
}

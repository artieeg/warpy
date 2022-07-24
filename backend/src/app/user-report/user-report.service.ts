import { UserReportStore } from './user-report.store';

export class UserReportService {
  constructor(private userReportStore: UserReportStore) {}

  async addUserReport(
    reported: string,
    reporter: string,
    reportReasonId: string,
  ) {
    await this.userReportStore.create({
      reportee: reporter,
      reported,
      reason: reportReasonId,
    });
  }
}

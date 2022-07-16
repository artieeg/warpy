import { IUserReportStore } from 'lib';

export interface IUserReportService {
  addUserReport(
    reported: string,
    reporter: string,
    reportReasonId: string,
  ): Promise<void>;
}

export class UserReportService implements IUserReportService {
  constructor(private userReportEntity: IUserReportStore) {}

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

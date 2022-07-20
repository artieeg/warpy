import { PrismaClient } from '@prisma/client';

export interface IUserReportStore {
  create(params: {
    reportee: string;
    reported: string;
    reason: string;
  }): Promise<void>;
}

export class UserReportStore implements IUserReportStore {
  constructor(private prisma: PrismaClient) {}

  async create({
    reportee,
    reported,
    reason,
  }: {
    reportee: string;
    reported: string;
    reason: string;
  }) {
    await this.prisma.report.create({
      data: {
        reason,
        reported_id: reported,
        reporter_id: reportee,
      },
    });
  }
}

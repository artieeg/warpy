import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserReportEntity {
  constructor(private prisma: PrismaService) {}

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

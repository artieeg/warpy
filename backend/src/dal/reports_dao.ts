import { prisma, runPrismaQuery } from "./client";

export const ReportDAO = {
  async create({
    reportee,
    reported,
    reason,
  }: {
    reportee: string;
    reported: string;
    reason: string;
  }) {
    await runPrismaQuery(() =>
      prisma.report.create({
        data: {
          reason,
          reported_id: reported,
          reporter_id: reportee,
        },
      })
    );
  },
};

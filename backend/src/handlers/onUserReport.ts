import {
  IUserReportRequest,
  IUserReportResponse,
  MessageHandler,
} from "@warpy/lib";
import { UserService } from "@backend/services";

export const onUserReport: MessageHandler<
  IUserReportRequest,
  IUserReportResponse
> = async ({ reportedUserId, reportReasonId, user }, respond) => {
  await UserService.addUserReport(reportedUserId, user, reportReasonId);

  respond({
    reportedUser: reportedUserId,
  });
};

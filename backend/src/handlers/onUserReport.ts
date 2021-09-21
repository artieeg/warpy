import { IUserReportRequest, MessageHandler } from "@warpy/lib";
import { UserService } from "@backend/services";

export const onUserReport: MessageHandler<IUserReportRequest, any> = async (
  { reportedUserId, reportReasonId, user },
  respond
) => {
  await UserService.addUserReport(reportedUserId, user, reportReasonId);

  respond({
    status: "ok",
  });
};

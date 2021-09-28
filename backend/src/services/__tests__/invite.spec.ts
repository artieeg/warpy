import { InviteDAO } from "@backend/dal";
import { InviteService } from "../invite";
import { NotificationService } from "../index";
import { createUserFixture } from "@backend/__fixtures__";
import { mocked } from "ts-jest/utils";

describe("InviteService", () => {
  const invitedUserId = "test-user-id-1";
  const inviterUserId = "test-user-id-2";
  const stream = "test-stream-id";

  const invited = createUserFixture({
    id: invitedUserId,
  });

  const inviter = createUserFixture({
    id: inviterUserId,
  });

  const record = {
    stream,
    inviter,
    invitee: invited,
  };

  beforeAll(() => {
    mocked(InviteDAO).create.mockResolvedValue(record);
  });

  it("creates new invite", async () => {
    const result = await InviteService.createStreamInvite({
      inviter: inviterUserId,
      invitee: invitedUserId,
      stream,
    });

    expect(InviteDAO.create).toHaveBeenCalledWith({
      invitee: invitedUserId,
      inviter: inviterUserId,
      stream,
    });

    expect(result).toBe(record);
  });

  it("creates a new notification", async () => {
    await InviteService.createStreamInvite({
      inviter: inviterUserId,
      invitee: invitedUserId,
      stream,
    });

    expect(NotificationService.createInviteNotification).toHaveBeenCalledWith(
      record
    );
  });

  it.todo("checks if inviter is a follower or followed by invitee ");
});

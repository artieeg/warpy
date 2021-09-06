import { FollowService } from "../follow";
import { mocked } from "ts-jest/utils";
import { FollowRecordDAL } from "@backend/dal/follow_record_dal";

describe("FollowService", () => {
  const mockedFollowRecordDAL = mocked(FollowRecordDAL);

  const follower = "test-follower";
  const followed = "test-followed";

  it("creates new follow record", async () => {
    await FollowService.createNewFollow(follower, followed);

    expect(mockedFollowRecordDAL.createNewFollow).toBeCalledWith(
      follower,
      followed
    );
  });

  it("deletes a follow record", async () => {
    await FollowService.deleteFollow(follower, followed);

    expect(mockedFollowRecordDAL.deleteFollow).toBeCalledWith(
      follower,
      followed
    );
  });

  it("emits new follow record event", async () => {
    const onNewFollow = jest.fn();

    FollowService.onFollowCreated(onNewFollow);

    await FollowService.createNewFollow(follower, followed);

    expect(onNewFollow).toBeCalled();
  });

  it("emits an event when follow record is deleted", async () => {
    const onFollowDeleted = jest.fn();

    FollowService.onFollowDeleted(onFollowDeleted);

    await FollowService.deleteFollow(follower, followed);

    expect(onFollowDeleted).toBeCalled();
  });
});

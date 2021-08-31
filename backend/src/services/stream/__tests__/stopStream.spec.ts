import { mocked } from "ts-jest/utils";
import { StreamDAL } from "@backend/dal";
import { StreamService } from "../index";

describe("StreamService.stopStream", () => {
  const mockedStreamDAL = mocked(StreamDAL);
  const user = "test-user-id";

  it("deletes streams", async () => {
    await StreamService.stopStream(user);

    expect(mockedStreamDAL.deleteByUser).toBeCalledWith(user);
  });
});

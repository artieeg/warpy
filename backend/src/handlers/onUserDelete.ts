import { UserService } from "@backend/services";
import { IUserDelete, IUserDeleteResponse, MessageHandler } from "@warpy/lib";

export const onUserDelete: MessageHandler<IUserDelete, IUserDeleteResponse> =
  async (data, respond) => {
    const { user } = data;

    await UserService.deleteUser(user);

    respond({
      status: "ok",
    });
  };

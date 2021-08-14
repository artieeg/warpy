import { INewUser, INewUserResponse, MessageHandler } from "@warpy/lib";
import { UserService } from "@backend/services";

export const onNewUser: MessageHandler<INewUser, INewUserResponse> = async (
  data,
  respond
) => {
  if (data.kind === "dev") {
    const response = await UserService.createDevUser(data);
    respond(response);
  }
};

import { INewUser, INewUserResponse, MessageHandler } from "@warpy/lib";
import { UserService } from "@backend/services";

const createUser = (data: INewUser) => {
  if (data.kind === "dev") {
    return UserService.createDevUser(data);
  }

  return null;
};

export const onNewUser: MessageHandler<INewUser, INewUserResponse> = async (
  data,
  respond
) => {
  console.log("user", data);
  const response = await createUser(data);

  if (response) {
    respond(response);
  }
};

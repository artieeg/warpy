import { UserService } from "@backend/services";
import { MessageHandler, IWhoAmIRequest, IWhoAmIResponse } from "@warpy/lib";

export const onWhoAmIRequest: MessageHandler<IWhoAmIRequest, IWhoAmIResponse> =
  async (data, respond) => {
    const { user } = data;

    const userData = await UserService.whoAmI(user);

    respond!({ user: userData });
  };

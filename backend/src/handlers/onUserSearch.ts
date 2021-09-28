import { UserService } from "@backend/services";
import {
  IUserSearchRequest,
  IUserSearchResponse,
  MessageHandler,
} from "@warpy/lib";

export const onUserSearch: MessageHandler<
  IUserSearchRequest,
  IUserSearchResponse
> = async ({ textToSearch }, respond) => {
  const users = await UserService.search(textToSearch);

  respond({
    users,
  });
};

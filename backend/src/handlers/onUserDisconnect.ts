import { StreamService } from "@backend/services";
import { MessageHandler, IUserDisconnected } from "@warpy/lib";

export const onUserDisconnect: MessageHandler<IUserDisconnected> = async (
  data
) => {
  const { user } = data;

  StreamService.removeUser(user);
};

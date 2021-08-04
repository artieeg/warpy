import { UserModel, RefreshToken, BaseUser } from "@app/models";
import { jwt } from "@app/utils";
import { MessageService } from "@app/services";
import { MessageHandler, IWhoAmIRequest } from "@warpy/lib";

/*
 * Creates a dev account. Should be disabled in production
 * */
export const createDevUser = async (data: any) => {
  const { username, last_name, first_name, email } = data;

  const user = new UserModel({
    username,
    last_name,
    first_name,
    email,
    sub: "DEV_ACCOUNT",
    avatar: "test-avatar",
  });

  const accessToken = jwt.createToken(user.id, "1d");
  const refreshToken = jwt.createToken(user.id, "1y");

  const token = new RefreshToken({
    token: refreshToken,
  });

  await Promise.all([user.save(), token.save()]);

  return {
    id: user.id,
    access: accessToken,
    refresh: refreshToken,
  };
};

export const onWhoAmIRequest: MessageHandler<IWhoAmIRequest> = async (data) => {
  const { user } = data;

  const userData = await getUserById(user);

  MessageService.sendMessage(user, {
    event: "whoami",
    data: {
      user: userData,
    },
  });
};

export const getUserById = async (userId: string): Promise<BaseUser | null> => {
  const result = await UserModel.findOne({ _id: userId });

  if (!result) {
    return null;
  }

  return BaseUser.fromJSON(result.toJSON());
};

export const getUsersByIds = async (users: string[]): Promise<BaseUser[]> => {
  const result = await UserModel.find({ _id: { $in: users } });

  return result.map((item: any) => BaseUser.fromJSON(item.toJSON()));
};

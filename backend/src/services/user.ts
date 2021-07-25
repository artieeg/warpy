import { User, RefreshToken, IUser } from "@app/models";
import { jwt } from "@app/utils";

/*
 * Create a dev account. Should be disabled in production
 * */
export const createDevUser = async (data: any) => {
  const { username, last_name, first_name, email } = data;

  const user = new User({
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

export const getUserById = async (userId: string): Promise<IUser> => {
  const result = await User.findOne({ _id: userId });
  const user = result.toJSON();

  return user;
};

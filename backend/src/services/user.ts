import { User, RefreshToken } from "@backend/models";
import { BaseUser } from "@warpy/lib";
import { jwt } from "@backend/utils";

/*
 * Creates a dev account. Should be disabled in production
 * */
export const createDevUser = async (data: any) => {
  const { username, last_name, first_name, email } = data;

  const user = User.fromJSON({
    username,
    last_name,
    first_name,
    email,
    sub: "DEV_ACCOUNT",
    avatar: "https://media.giphy.com/media/nDSlfqf0gn5g4/giphy.gif",
  });

  await user.save();

  const accessToken = jwt.createToken(user.id, "1d");
  const refreshToken = jwt.createToken(user.id, "1y");

  const token = new RefreshToken();
  token.token = refreshToken;
  token.save();

  return {
    id: user.id,
    access: accessToken,
    refresh: refreshToken,
  };
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const result = await User.findOne(userId);

  if (!result) {
    return null;
  }

  return result;
};

export const getUsersByIds = async (users: string[]): Promise<BaseUser[]> => {
  const result = await User.findByIds(users);

  return result.map((item: any) => BaseUser.fromJSON(item.toJSON()));
};

import { IUser, RefreshToken } from "@backend/models";
import { jwt } from "@backend/utils";
import { UserDAL } from "@backend/dal";

/*
 * Creates a dev account. Should be disabled in production
 * */
export const createDevUser = async (data: any) => {
  const { username, last_name, first_name, email } = data;

  const user = await UserDAL.createNewUser({
    username,
    last_name,
    first_name,
    email,
    sub: "DEV_ACCOUNT",
    avatar: "https://media.giphy.com/media/nDSlfqf0gn5g4/giphy.gif",
  });

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

export const deleteUser = (user: string) => {
  return UserDAL.deleteById(user);
};

export const whoAmI = async (user: string): Promise<IUser | null> => {
  const data = await UserDAL.findById(user);

  if (!data) {
    return null;
  }

  return data;
};

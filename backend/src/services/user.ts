import { jwt } from "@backend/utils";
import { IUser, ParticipantDAL, RefreshTokenDAL, UserDAL } from "@backend/dal";
import { INewUser } from "@warpy/lib";

type NewUserResponse = {
  id: string;
  access: string;
  refresh: string;
};

/*
 * Creates a dev account. Should be disabled in production
 * */
export const createDevUser = async (
  data: INewUser
): Promise<NewUserResponse> => {
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

  await RefreshTokenDAL.create(refreshToken);

  return {
    id: user.id,
    access: accessToken,
    refresh: refreshToken,
  };
};

export const deleteUser = async (user: string): Promise<void> => {
  await ParticipantDAL.deleteParticipant(user);
  await UserDAL.deleteById(user);
};

export const whoAmI = async (user: string): Promise<IUser | null> => {
  return UserDAL.findById(user);
};

import { jwt } from "@backend/utils";
import { FollowRecordDAL, RefreshTokenDAL, UserDAO } from "@backend/dal";
import { INewUser, IWhoAmIResponse } from "@warpy/lib";

type NewUserResponse = {
  id: string;
  access: string;
  refresh: string;
};

export const UserService = {
  /*
   * Creates a dev account. Should be disabled in production
   * */
  async createDevUser(data: INewUser): Promise<NewUserResponse> {
    const { username, last_name, first_name, email } = data;

    const user = await UserDAO.createNewUser({
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
  },

  async deleteUser(user: string): Promise<void> {
    await UserDAO.delete(user);
  },

  async whoAmI(id: string): Promise<IWhoAmIResponse> {
    const [user, following] = await Promise.all([
      UserDAO.findById(id),
      FollowRecordDAL.getFollowedUserIds(id),
    ]);

    return {
      user,
      following,
    };
  },
};

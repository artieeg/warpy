import { User } from "@prisma/client";
import { prisma, runPrismaQuery } from "./client";
import { IUser } from "@warpy/lib";

type NewUserParams = Omit<Omit<User, "id">, "created_at">;

export const toUserDTO = (data: User, includeDetails = false): IUser => {
  return {
    id: data.id,
    last_name: data.last_name,
    first_name: data.first_name,
    username: data.username,
    avatar: data.avatar,
    sub: includeDetails ? data.sub : null,
    email: includeDetails ? data.email : null,
  };
};

export const UserDAO = {
  async createNewUser(data: NewUserParams): Promise<User> {
    const user = await runPrismaQuery(() =>
      prisma.user.create({
        data,
      })
    );

    return user;
  },

  async search(textToSearch: string): Promise<IUser[]> {
    const users = await runPrismaQuery(() =>
      prisma.user.findMany({
        where: {
          OR: [
            {
              first_name: {
                contains: textToSearch,
                mode: "insensitive",
              },
            },
            {
              last_name: {
                contains: textToSearch,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: textToSearch,
                mode: "insensitive",
              },
            },
          ],
        },
      })
    );

    return users.map((user) => toUserDTO(user));
  },

  async findById(id: string, details = false): Promise<IUser | null> {
    const user = await runPrismaQuery(() =>
      prisma.user.findUnique({
        where: { id },
      })
    );

    return user ? toUserDTO(user, details) : null;
  },

  async delete(id: string): Promise<User> {
    return await runPrismaQuery(() => prisma.user.delete({ where: { id } }));
  },
};

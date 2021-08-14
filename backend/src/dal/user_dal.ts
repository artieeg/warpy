import { User } from "@prisma/client";
import { prisma } from "./client";

type NewUserParams = Omit<Omit<User, "id">, "created_at">;

export const UserDAL = {
  createNewUser: async (data: NewUserParams): Promise<User> => {
    const user = await prisma.user.create({
      data,
    });

    return user;
  },
  findById: async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  },
  deleteById: (id: string): Promise<User> => {
    return prisma.user.delete({ where: { id } });
  },
};

import { PrismaClient } from '@prisma/client';

export class DeveloperAccountStore {
  constructor(private prismaService: PrismaClient) {}

  async getDeveloperAccount(user: string) {
    const { id } = await this.prismaService.developerAccount.findUnique({
      where: { user_id: user },
      select: { id: true },
    });

    return id;
  }
}

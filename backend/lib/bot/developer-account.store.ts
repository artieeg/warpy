import { PrismaClient } from '@prisma/client';

export interface IDeveloperAccountStore {
  getDeveloperAccount(user: string): Promise<string>;
}

export class DeveloperAccountStore implements IDeveloperAccountStore {
  constructor(private prismaService: PrismaClient) {}

  async getDeveloperAccount(user: string) {
    const { id } = await this.prismaService.developerAccount.findUnique({
      where: { user_id: user },
      select: { id: true },
    });

    return id;
  }
}

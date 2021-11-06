import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeveloperAccountEntity {
  constructor(private prismaService: PrismaService) {}

  async getDeveloperAccount(user: string) {
    const { id } = await this.prismaService.developerAccount.findUnique({
      where: { user_id: user },
      select: { id: true },
    });

    return id;
  }
}

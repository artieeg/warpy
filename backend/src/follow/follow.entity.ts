import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IUser } from '@warpy/lib';
import { FollowStoreImpl } from 'lib/stores/follow';

export interface IFollow {
  follower_id: string;
  followed_id: string;
  follower?: IUser;
  followed?: IUser;
}

@Injectable()
export class FollowStore extends FollowStoreImpl {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

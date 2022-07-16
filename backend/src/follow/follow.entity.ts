import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IUser } from '@warpy/lib';
import { FollowStore } from 'lib';

export interface IFollow {
  follower_id: string;
  followed_id: string;
  follower?: IUser;
  followed?: IUser;
}

@Injectable()
export class NjsFollowStore extends FollowStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

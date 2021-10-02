import { BannedFromStreamError } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../media/media.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class StreamService {
  constructor(
    private user: UserEntity,
    private media: MediaService,
    private streamBlocks: StreamBlockService,
  ) {}

  async addNewViewer(stream: string, viewerId: string) {
    const viewer = await this.user.findById(viewerId);

    const { token, permissions } = await this.media.createNewViewer(
      viewerId,
      stream,
    );

    await this.streamBlocks.checkUserBanned(viewerId, stream);
  }
}

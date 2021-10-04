import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ICandidate, IStream } from '@warpy/lib';
import { BlockEntity } from '../block/block.entity';
import { BlockService } from '../block/block.service';
import { ParticipantEntity } from '../participant/participant.entity';
import { StreamEntity } from '../stream/stream.entity';

@Injectable()
export class FeedService {
  constructor(
    @Inject(forwardRef(() => BlockEntity))
    private blockEntity: BlockEntity,

    private streamEntity: StreamEntity,
    private participantEntity: ParticipantEntity,
  ) {}

  private async getFeedCandidate(stream: IStream): Promise<ICandidate> {
    return {
      ...stream,
      participants: await this.participantEntity.count(stream.id),
      speakers: await this.participantEntity.getSpeakers(stream.id),
    };
  }

  async getFeed(user: string) {
    const blockedUserIds = await this.blockEntity.getBlockedUserIds(user);
    const blockedByUserIds = await this.blockEntity.getBlockedByIds(user);

    const streams: IStream[] = await this.streamEntity.get({
      blockedUserIds,
      blockedByUserIds,
    });

    const feed = await Promise.all(
      streams.map((s) => this.getFeedCandidate(s)),
    );

    return feed;
  }
}

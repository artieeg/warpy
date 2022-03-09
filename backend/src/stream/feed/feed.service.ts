import { StreamEntity } from '@backend_2/stream/common/stream.entity';
import { BlockService } from '@backend_2/user/block/block.service';
import { ParticipantEntity } from '@backend_2/user/participant/common/participant.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ICandidate, IStream } from '@warpy/lib';

@Injectable()
export class FeedService {
  constructor(
    @Inject(forwardRef(() => BlockService))
    private blockService: BlockService,

    private streamEntity: StreamEntity,
    private participantEntity: ParticipantEntity,
  ) {}

  private async getFeedCandidate(stream: IStream): Promise<ICandidate> {
    const [total_participants, speakers] = await Promise.all([
      this.participantEntity.count(stream.id),
      this.participantEntity.getSpeakers(stream.id),
    ]);

    return {
      ...stream,
      total_participants,
      speakers,
    };
  }

  private getCandidatesFromStreams(streams: IStream[]): Promise<ICandidate[]> {
    return Promise.all(streams.map((s) => this.getFeedCandidate(s)));
  }

  async search(text: string) {
    const streams = await this.streamEntity.search(text);
    const candidates = await this.getCandidatesFromStreams(streams);

    return candidates;
  }

  async getFeed(user: string, category?: string) {
    const [blockedUserIds, blockedByUserIds] = await Promise.all([
      this.blockService.getBlockedUserIds(user),
      this.blockService.getBlockedByIds(user),
    ]);

    const streams: IStream[] = await this.streamEntity.get({
      blockedUserIds,
      blockedByUserIds,
      category: category === 'foru' ? undefined : category,
    });

    const feed = await this.getCandidatesFromStreams(streams);

    return feed;
  }
}

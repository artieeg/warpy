import { StreamStore } from '@warpy-be/stream/common/stream.entity';
import { ParticipantStore } from '@warpy-be/user/participant/store';
import { Injectable } from '@nestjs/common';
import { ICandidate, IStream } from '@warpy/lib';
import { BlockService } from '@warpy-be/block/block.service';

@Injectable()
export class FeedService {
  constructor(
    private blockService: BlockService,
    private streamEntity: StreamStore,
    private participantEntity: ParticipantStore,
  ) {}

  private async getFeedCandidate(stream: IStream): Promise<ICandidate> {
    const [total_participants, speakers] = await Promise.all([
      this.participantEntity.count(stream.id),
      this.participantEntity.getStreamers(stream.id),
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

    const streams: IStream[] = await this.streamEntity.find({
      blockedUserIds,
      blockedByUserIds,
      category: category === 'foru' ? undefined : category,
    });

    const feed = await this.getCandidatesFromStreams(streams);

    return feed;
  }
}

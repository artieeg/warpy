import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ICandidate, IStream } from '@warpy/lib';
import { BlockEntity } from '../block/block.entity';
import { ParticipantEntity } from '../participant/common/participant.entity';
import { StreamEntity } from '../stream/stream.entity';

@Injectable()
export class CandidateService {
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

  private getCandidatesFromStreams(streams: IStream[]): Promise<ICandidate[]> {
    return Promise.all(streams.map((s) => this.getFeedCandidate(s)));
  }

  async search(text: string) {
    const streams = await this.streamEntity.search(text);
    const candidates = await this.getCandidatesFromStreams(streams);

    return candidates;
  }

  async getFeed(user: string, category?: string) {
    const blockedUserIds = await this.blockEntity.getBlockedUserIds(user);
    const blockedByUserIds = await this.blockEntity.getBlockedByIds(user);

    const streams: IStream[] = await this.streamEntity.get({
      blockedUserIds,
      blockedByUserIds,
      category: category === 'foru' ? undefined : category,
    });

    const feed = await this.getCandidatesFromStreams(streams);

    return feed;
  }
}

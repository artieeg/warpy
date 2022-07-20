import { ICandidate, IStream } from '@warpy/lib';
import { IParticipantStore, IStreamStore } from 'lib';
import { IUserBlockService } from '../user-block';

export class FeedService {
  constructor(
    private blockService: IUserBlockService,
    private streamEntity: IStreamStore,
    private participantEntity: IParticipantStore,
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

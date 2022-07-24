import { ICandidate, IStream } from '@warpy/lib';
import { IParticipantStore, IStreamStore } from 'lib';
import { IUserBlockService } from '../user-block';

export class FeedService {
  constructor(
    private blockService: IUserBlockService,
    private streamService: IStreamStore,
    private participantService: IParticipantStore,
  ) {}

  private async getFeedCandidate(stream: IStream): Promise<ICandidate> {
    const [total_participants, streamers] = await Promise.all([
      this.participantService.count(stream.id),
      this.participantService.getStreamers(stream.id),
    ]);

    return {
      ...stream,
      total_participants,
      streamers,
    };
  }

  private getCandidatesFromStreams(streams: IStream[]): Promise<ICandidate[]> {
    return Promise.all(streams.map((s) => this.getFeedCandidate(s)));
  }

  async search(text: string) {
    const streams = await this.streamService.search(text);
    const candidates = await this.getCandidatesFromStreams(streams);

    return candidates;
  }

  async getFeed(user: string, category?: string) {
    const [blockedUserIds, blockedByUserIds] = await Promise.all([
      this.blockService.getBlockedUserIds(user),
      this.blockService.getBlockedByIds(user),
    ]);

    const streams: IStream[] = await this.streamService.find({
      blockedUserIds,
      blockedByUserIds,
      category: category === 'foru' ? undefined : category,
    });

    const feed = await this.getCandidatesFromStreams(streams);

    return feed;
  }
}

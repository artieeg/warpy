import { Candidate, Stream } from '@warpy/lib';
import { ParticipantStore, StreamStore } from '@warpy-be/app';
import { UserBlockService } from '../user-block';

export class FeedService {
  constructor(
    private blockService: UserBlockService,
    private streamService: StreamStore,
    private participantService: ParticipantStore,
  ) {}

  private async getFeedCandidate(stream: Stream): Promise<Candidate> {
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

  private getCandidatesFromStreams(streams: Stream[]): Promise<Candidate[]> {
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

    const streams: Stream[] = await this.streamService.find({
      blockedUserIds,
      blockedByUserIds,
      category: category === 'foru' ? undefined : category,
    });

    const feed = await this.getCandidatesFromStreams(streams);

    return feed;
  }
}

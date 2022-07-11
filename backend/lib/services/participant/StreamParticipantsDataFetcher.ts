import { IParticipant } from '@warpy/lib';
import { IParticipantStore } from 'lib/stores';
import { IHostService } from '../stream-host';

type StreamData = {
  streamers: IParticipant[];
  raisedHands: IParticipant[];
  count: number;
  host: string;
};

export interface StreamParticipantDataFetcher {
  getParticipantDataOnStream(stream: string): Promise<StreamData>;
}

export class StreamParticipantDataFetcherImpl
  implements StreamParticipantDataFetcher
{
  constructor(
    private store: IParticipantStore,
    private hostService: IHostService,
  ) {}

  async getParticipantDataOnStream(stream: string) {
    const [speakers, raisedHands, count, host] = await Promise.all([
      this.store.getStreamers(stream),
      this.store.getRaisedHands(stream),
      this.store.count(stream),
      this.hostService.getStreamHostId(stream),
    ]);

    return {
      streamers: speakers,
      raisedHands,
      count,
      host,
    };
  }
}

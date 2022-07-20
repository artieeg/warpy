import { IParticipant } from '@warpy/lib';
import { IParticipantStore } from 'lib/stores';

type StreamData = {
  streamers: IParticipant[];
  raisedHands: IParticipant[];
  count: number;
};

export interface StreamParticipantDataFetcher {
  getParticipantDataOnStream(stream: string): Promise<StreamData>;
}

export class StreamParticipantDataFetcherImpl
  implements StreamParticipantDataFetcher
{
  constructor(private store: IParticipantStore) {}

  async getParticipantDataOnStream(stream: string) {
    const [speakers, raisedHands, count] = await Promise.all([
      this.store.getStreamers(stream),
      this.store.getRaisedHands(stream),
      this.store.count(stream),
    ]);

    return {
      streamers: speakers,
      raisedHands,
      count,
    };
  }
}

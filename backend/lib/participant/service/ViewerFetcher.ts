import { IParticipant } from '@warpy/lib';
import { IParticipantStore } from 'lib';

export interface ViewerFetcher {
  getViewers(stream: string, page: number): Promise<IParticipant[]>;
}

export class ViewerFetcherImpl implements ViewerFetcher {
  constructor(private store: IParticipantStore) {}

  async getViewers(stream: string, page: number) {
    const viewers = await this.store.getViewersPage(stream, page);
    return viewers;
  }
}

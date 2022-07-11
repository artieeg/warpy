import { EventEmitter2 } from '@nestjs/event-emitter';
import { BotInstanceStore, IParticipantStore } from 'lib/stores';
import { IHostService } from '../stream-host';
import {
  ParticipantRemover,
  ParticipantRemoverImpl,
} from './ParticipantRemover';
import {
  StreamParticipantDataFetcher,
  StreamParticipantDataFetcherImpl,
} from './StreamParticipantsDataFetcher';

export class ParticipantService
  implements StreamParticipantDataFetcher, ParticipantRemover
{
  private streamParticipantDataFetcher: StreamParticipantDataFetcher;
  private remover: ParticipantRemover;

  constructor(
    store: IParticipantStore,
    hostService: IHostService,
    botInstanceStore: BotInstanceStore,
    events: EventEmitter2,
  ) {
    this.streamParticipantDataFetcher = new StreamParticipantDataFetcherImpl(
      store,
      hostService,
    );
    this.remover = new ParticipantRemoverImpl(botInstanceStore, events, store);
  }

  handleLeavingParticipant(user: string) {
    return this.remover.handleLeavingParticipant(user);
  }

  removeUserFromStream(user: string, stream?: string) {
    return this.remover.removeUserFromStream(user, stream);
  }

  removeAllParticipantsFrom(stream: string) {
    return this.remover.removeAllParticipantsFrom(stream);
  }

  /**
   * Returns stream's speakers, host, users with raised hands
   * and total amount of people on the stream
   * */
  getParticipantDataOnStream(stream: string) {
    return this.streamParticipantDataFetcher.getParticipantDataOnStream(stream);
  }
}

import { EventEmitter2 } from '@nestjs/event-emitter';
import { BotInstanceStore, IParticipantStore } from 'lib/stores';
import { IMediaService } from '../media';
import { IStreamBanService } from '../stream-bans';
import { IHostService } from '../stream-host';
import { IUserService } from '../user';
import { MediaToggler, MediaTogglerImpl } from './MediaToggler';
import {
  ParticipantCreator,
  ParticipantCreatorImpl,
} from './ParticipantCreator';
import {
  ParticipantRemover,
  ParticipantRemoverImpl,
} from './ParticipantRemover';
import {
  StreamParticipantDataFetcher,
  StreamParticipantDataFetcherImpl,
} from './StreamParticipantsDataFetcher';

export interface IParticipantService
  extends StreamParticipantDataFetcher,
    ParticipantRemover,
    ParticipantCreator,
    MediaToggler {}

export class ParticipantService implements IParticipantService {
  private streamParticipantDataFetcher: StreamParticipantDataFetcher;
  private remover: ParticipantRemover;
  private creator: ParticipantCreator;
  private mediaToggler: MediaToggler;

  constructor(
    store: IParticipantStore,
    hostService: IHostService,
    botInstanceStore: BotInstanceStore,
    events: EventEmitter2,
    user: IUserService,
    bans: IStreamBanService,
    media: IMediaService,
  ) {
    this.streamParticipantDataFetcher = new StreamParticipantDataFetcherImpl(
      store,
      hostService,
    );
    this.remover = new ParticipantRemoverImpl(botInstanceStore, events, store);
    this.creator = new ParticipantCreatorImpl(store, user, bans, events, media);
    this.mediaToggler = new MediaTogglerImpl(store, events);
  }

  setMediaEnabled(
    user: string,
    params: { audioEnabled?: boolean; videoEnabled?: boolean },
  ): Promise<void> {
    return this.mediaToggler.setMediaEnabled(user, params);
  }

  createNewParticipant(stream: string, user: string) {
    return this.creator.createNewParticipant(stream, user);
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

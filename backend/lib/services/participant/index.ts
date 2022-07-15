import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_RAISE_HAND } from '@warpy-be/utils';
import { BotInstanceStore, IParticipantStore } from 'lib/stores';
import { IMediaService } from '../media';
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
    private store: IParticipantStore,
    botInstanceStore: BotInstanceStore,
    private events: EventEmitter2,
    user: IUserService,
    media: IMediaService,
  ) {
    this.streamParticipantDataFetcher = new StreamParticipantDataFetcherImpl(
      store,
    );
    this.remover = new ParticipantRemoverImpl(botInstanceStore, events, store);
    this.creator = new ParticipantCreatorImpl(store, user, events, media);
    this.mediaToggler = new MediaTogglerImpl(store, events);
  }

  async setRaiseHand(user: string, flag: boolean) {
    const participant = await this.store.setRaiseHand(user, flag);

    this.events.emit(EVENT_RAISE_HAND, participant);
  }

  async getViewers(stream: string, page: number) {
    const viewers = await this.store.getViewersPage(stream, page);

    return viewers;
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

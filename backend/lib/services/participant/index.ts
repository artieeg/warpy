import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_RAISE_HAND } from '@warpy-be/utils';
import { BotInstanceStore, IParticipantStore } from 'lib';
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
  StreamingPermissionRequester,
  StreamingPermissionRequesterImpl,
} from './StreamingPermissionRequester';
import {
  StreamParticipantDataFetcher,
  StreamParticipantDataFetcherImpl,
} from './StreamParticipantsDataFetcher';
import { ViewerFetcher, ViewerFetcherImpl } from './ViewerFetcher';

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
  private streamingPermissionRequester: StreamingPermissionRequester;
  private viewerFetcher: ViewerFetcher;

  constructor(
    store: IParticipantStore,
    botInstanceStore: BotInstanceStore,
    events: EventEmitter2,
    user: IUserService,
    media: IMediaService,
  ) {
    this.streamParticipantDataFetcher = new StreamParticipantDataFetcherImpl(
      store,
    );
    this.remover = new ParticipantRemoverImpl(botInstanceStore, events, store);
    this.creator = new ParticipantCreatorImpl(store, user, events, media);
    this.mediaToggler = new MediaTogglerImpl(store, events);
    this.streamingPermissionRequester = new StreamingPermissionRequesterImpl(
      store,
      events,
    );
    this.viewerFetcher = new ViewerFetcherImpl(store);
  }

  setRaiseHand(user: string, flag: boolean) {
    return this.streamingPermissionRequester.setRaiseHand(user, flag);
  }

  async getViewers(stream: string, page: number) {
    return this.viewerFetcher.getViewers(stream, page);
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

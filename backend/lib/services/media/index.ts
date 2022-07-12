import { ParticipantNodeAssignerStore } from 'lib/stores';
import { MediaBalancerService } from '../media-balancer';
import { NatsService } from '../nats';
import {
  MediaConnectionParamsProvider,
  MediaConnectionParamsProviderImpl,
} from './ViewerConnectionParamsProvider';

export interface IMediaService extends MediaConnectionParamsProvider {}

export class MediaService implements IMediaService {
  private viewerConnectionParamsProvider: MediaConnectionParamsProvider;

  constructor(
    nodeAssigner: ParticipantNodeAssignerStore,
    balancer: MediaBalancerService,
    nc: NatsService,
  ) {
    this.viewerConnectionParamsProvider = new MediaConnectionParamsProviderImpl(
      nodeAssigner,
      balancer,
      nc,
    );
  }

  getViewerParams(user: string, stream: string) {
    return this.viewerConnectionParamsProvider.getViewerParams(user, stream);
  }

  getStreamerParams(params: {
    user: string;
    roomId: string;
    audio: boolean;
    video: boolean;
  }): Promise<{ token: string; sendMediaParams: any; recvMediaParams: any }> {
    return this.viewerConnectionParamsProvider.getStreamerParams(params);
  }
}

import { ParticipantNodeAssignerStore } from 'lib/stores';
import {
  IConnectRecvTransportParams,
  ICreateTransport,
  IMediaPermissions,
  INewTransportResponse,
} from '@warpy/lib';
import * as jwt from 'jsonwebtoken';
import { MediaBalancerService } from '../media-balancer';
import { NatsService } from '../nats';

export type MediaConnectionParams = {
  token: string;
  recvMediaParams: any;
};

export interface MediaConnectionParamsProvider {
  getViewerParams(user: string, stream: string): Promise<MediaConnectionParams>;
  getStreamerParams(params: {
    user: string;
    roomId: string;
    audio: boolean;
    video: boolean;
  }): Promise<{
    token: string;
    sendMediaParams: any;
    recvMediaParams: any;
  }>;
}

const secret = process.env.MEDIA_JWT_SECRET || 'test-secret';

export class MediaConnectionParamsProviderImpl
  implements MediaConnectionParamsProvider
{
  constructor(
    private participantNodeAssigner: ParticipantNodeAssignerStore,
    private balancer: MediaBalancerService,
    private nc: NatsService,
  ) {}

  createPermissionToken(permissions: IMediaPermissions): string {
    return jwt.sign(permissions, secret, {
      expiresIn: 60,
    });
  }

  private async getRecvParams(
    recvNodeId: string,
    user: string,
    roomId: string,
  ) {
    const recvMediaParams: IConnectRecvTransportParams = await this.nc.request(
      `media.peer.join.${recvNodeId}`,
      {
        user,
        roomId,
      },
      {
        timeout: 60000,
      },
    );

    return recvMediaParams;
  }

  private async getViewerToken(user: string, room: string) {
    const recvNodeId = await this.balancer.getRecvNodeId(room);

    const permissions: IMediaPermissions = {
      user,
      room,
      audio: false,
      video: false,
      recvNodeId,
    };

    const token = this.createPermissionToken(permissions);

    return { token, recvNodeId };
  }

  async getViewerParams(user: string, roomId: string) {
    const { token, recvNodeId } = await this.getViewerToken(user, roomId);
    const recvMediaParams = await this.getRecvParams(recvNodeId, user, roomId);

    await this.participantNodeAssigner.set(user, {
      recv: recvNodeId,
      send: undefined,
    });

    return {
      token,
      recvMediaParams,
    };
  }

  async getStreamerParams({
    user,
    roomId,
    audio,
    video,
  }: {
    user: string;
    roomId: string;
    audio: boolean;
    video: boolean;
  }) {
    const { token, recvNodeId, sendNodeId } = await this.getStreamerToken(
      user,
      roomId,
      audio,
      video,
    );

    const sendMediaParams = await this.createSendTransport({
      roomId,
      speaker: user,
    });

    const recvMediaParams = await this.getRecvParams(recvNodeId, user, roomId);

    await this.participantNodeAssigner.set(user, {
      recv: recvNodeId,
      send: sendNodeId,
    });

    return {
      token,
      recvMediaParams,
      sendMediaParams,
    };
  }

  private async getStreamerToken(
    user: string,
    stream: string,
    audio: boolean,
    video: boolean,
  ) {
    const [sendNodeId, recvNodeId] = await Promise.all([
      this.balancer.getSendNodeId(stream),
      this.balancer.getRecvNodeId(stream),
    ]);

    const token = this.createPermissionToken({
      user,
      room: stream,
      audio,
      video,
      sendNodeId,
      recvNodeId,
    });

    return { token, sendNodeId, recvNodeId };
  }

  async createSendTransport(
    params: ICreateTransport,
  ): Promise<INewTransportResponse> {
    const response = await this.nc.request(
      `media.transport.send-transport`,
      params,
      {
        timeout: 60000,
      },
    );

    return response as INewTransportResponse;
  }
}

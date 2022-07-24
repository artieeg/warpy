import {
  IConnectRecvTransportParams,
  ICreateMediaRoom,
  ICreateTransport,
  IKickedFromMediaRoom,
  IMediaPermissions,
  INewMediaRoomData,
  INewTransportResponse,
  IParticipant,
  Roles,
} from '@warpy/lib';
import { MediaBalancerService } from '../media-balancer';
import { NatsService } from '../nats';
import * as jwt from 'jsonwebtoken';
import { InternalError } from '@warpy-be/errors';
import { ParticipantNodeAssignerStore } from './participant-node-assigner.store';

const secret = process.env.MEDIA_JWT_SECRET || 'test-secret';

export type MediaConnectionParams = {
  token: string;
  recvMediaParams: any;
};

export class MediaService {
  constructor(
    private nodeAssigner: ParticipantNodeAssignerStore,
    private balancer: MediaBalancerService,
    private nc: NatsService,
  ) {}

  async createNewRoom(payload: ICreateMediaRoom): Promise<INewMediaRoomData> {
    const response = await this.nc.request('media.room.create', payload);

    return response as INewMediaRoomData;
  }

  createPermissionToken(permissions: IMediaPermissions): string {
    return jwt.sign(permissions, secret, {
      expiresIn: 60,
    });
  }

  async getBotParams(user: string, roomId: string) {
    const { recv } = await this.nodeAssigner.get(user);

    return this.getRecvParams(recv, user, roomId);
  }

  async getBotToken(bot: string, room: string) {
    const [sendNodeId, recvNodeId] = await Promise.all([
      this.balancer.getSendNodeId(room),
      this.balancer.getRecvNodeId(room),
    ]);

    const token = this.createPermissionToken({
      user: bot,
      room,
      audio: true,
      video: true,
      sendNodeId,
      recvNodeId,
    });

    return { token, sendNodeId, recvNodeId };
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

    await this.nodeAssigner.set(user, {
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

    await this.nodeAssigner.set(user, {
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

  async updateMediaRole(participant: IParticipant, role: Roles) {
    const { stream, id } = participant;

    const { recv: recvNodeId, send: prevSendNodeId } =
      await this.nodeAssigner.get(id);

    let sendMediaParams: INewTransportResponse;
    let sendNodeId = prevSendNodeId; //TODO: make use of prevSendNodeId?

    //If participant becomes audio/video streamer, assign them a send node
    if (role !== 'viewer') {
      sendNodeId = await this.balancer.getSendNodeId(stream);

      sendMediaParams = await this.createSendTransport({
        roomId: stream,
        speaker: id,
      });
    }

    await this.nodeAssigner.set(id, {
      send: sendNodeId,
      recv: recvNodeId,
    });

    const token = this.createPermissionToken({
      audio: role !== 'viewer',
      video: role === 'streamer',
      sendNodeId: role === 'viewer' ? null : sendNodeId,
      recvNodeId,
      user: id,
      room: stream,
    });

    return {
      mediaPermissionToken: token,
      sendMediaParams,
    };
  }

  private async kickFromRoom(user: string, stream: string, node: string) {
    const response = await this.nc.request(
      `media.peer.user-leave.${node}`,
      {
        user,
        stream,
      },
      { timeout: 5000 },
    );

    return response as IKickedFromMediaRoom;
  }

  async removeFromNodes({ id, stream }: { id: string; stream: string }) {
    //Fetch node ids the user has been assigned to
    const { send, recv } = await this.nodeAssigner.get(id);

    //Try to kick the user from those nodes
    const [sendNodeResponse, recvNodeResponse] = await Promise.all([
      send ? this.kickFromRoom(id, stream, send) : null,
      recv ? this.kickFromRoom(id, stream, recv) : null,
    ]);

    //check if we got responses from send/recv and the response status
    if (
      (sendNodeResponse && sendNodeResponse.status !== 'ok') ||
      (recvNodeResponse && recvNodeResponse.status !== 'ok')
    ) {
      throw new InternalError();
    } else {
      await this.nodeAssigner.del(id);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { MediaService } from '@warpy-be/media/media.service';
import { Roles } from '@warpy/lib';
import { ParticipantBanService } from '../ban/ban.service';
import { ParticipantStore } from '../store';

@Injectable()
export class StreamerService {
  constructor(
    private store: ParticipantStore,
    private media: MediaService,
    private bans: ParticipantBanService,
  ) {}

  /**
   * Checks if the user has been banned on the stream,
   * points streamer to new send/recv nodes, returns send/recv params and token
   * */
  async reconnectOldStreamer(user: string, stream: string, role: Roles) {
    await this.bans.checkUserBanned(user, stream);

    const {
      token: mediaPermissionsToken,
      sendMediaParams,
      recvMediaParams,
      sendNodeId,
      recvNodeId,
    } = await this.media.getStreamerParams({
      user,
      roomId: stream,
      audio: true,
      video: role === 'streamer',
    });

    //Update recv/send nodes
    await this.store.update(user, {
      recvNodeId,
      sendNodeId,
    });

    return { sendMediaParams, recvMediaParams, mediaPermissionsToken };
  }
}

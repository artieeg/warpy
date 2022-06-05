import { Injectable } from '@nestjs/common';
import { MediaService } from '@warpy-be/media/media.service';
import { Roles } from '@warpy/lib';
import { ParticipantBanService } from '../ban/ban.service';

@Injectable()
export class StreamerService {
  constructor(
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
    } = await this.media.getStreamerParams({
      user,
      roomId: stream,
      audio: true,
      video: role === 'streamer',
    });

    return { sendMediaParams, recvMediaParams, mediaPermissionsToken };
  }
}

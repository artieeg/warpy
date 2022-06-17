import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { InviteService } from "../invite";
import { MediaService } from "../media";
import { StateUpdate } from "../types";

export interface StreamLeaver {
  leave: (params: {
    shouldStopStream: boolean;
    stream: string;
  }) => Promise<StateUpdate>;
}

export class StreamLeaverImpl implements StreamLeaver {
  private state: AppState;
  private mediaService: MediaService;
  private inviteService: InviteService;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }

    this.inviteService = new InviteService(this.state);
    this.mediaService = new MediaService(this.state);
  }

  async leave({
    stream,
    shouldStopStream,
  }: {
    shouldStopStream: boolean;
    stream: string;
  }) {
    const { api } = this.state.get();

    if (stream) {
      if (shouldStopStream) {
        await api.stream.stop(stream);
      } else {
        await api.stream.leave(stream);
      }
    }

    await this.mediaService.close();
    await this.inviteService.reset();

    return this.state.getStateDiff();
  }
}

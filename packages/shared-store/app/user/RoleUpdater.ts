import { Roles } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { MediaService } from "../media";
import { ToastService } from "../toast";
import { StreamedStateUpdate } from "../types";

export interface RoleUpdater {
  updateUserRole: (params: {
    role: Roles;
    mediaPermissionToken: string;
    sendMediaParams: any;
  }) => StreamedStateUpdate;
}

export class RoleUpdaterImpl implements RoleUpdater {
  private state: AppState;

  private toast: ToastService;
  private media: MediaService;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }

    this.toast = new ToastService(this.state);
    this.media = new MediaService(this.state);
  }

  async *updateUserRole({
    role,
    mediaPermissionToken,
    sendMediaParams,
  }: {
    role: Roles;
    mediaPermissionToken: string;
    sendMediaParams: any;
  }) {
    const { role: oldRole } = this.state.get();

    this.state.update({
      role,
      isRaisingHand: false,
      sendMediaParams,
    });

    yield this.toast.showToastMessage(`You are a ${role} now`);

    if (role === "viewer") {
      yield this.media.closeProducer("audio", "video");
    } else if (role === "speaker") {
      yield this.media.closeProducer("video");
    }

    if (oldRole === "streamer" && role === "speaker") {
      yield this.state.update({ videoEnabled: false });
    } else if (role !== "viewer") {
      const kind = role === "speaker" ? "audio" : "video";

      yield await this.media.stream({
        token: mediaPermissionToken,
        //streamMediaImmediately: false,
        streamMediaImmediately: true,
        sendMediaParams,
        kind,
      });
    } else {
      yield this.state.update({
        videoEnabled: false,
        audioEnabled: false,
      });
    }

    yield this.state.update({
      role,
      isRaisingHand: false,
      sendMediaParams,
    });
  }
}

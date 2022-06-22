import { container } from "../../container";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { ModalService } from "../modal";

type InviteAction = "accept" | "decline";

export interface ReceivedInviteManager {
  accept: () => Promise<any>;
  decline: () => Promise<any>;
}

export class ReceivedInviteManagerImpl implements ReceivedInviteManager {
  private state: AppState;
  private modal: ModalService;

  constructor(state: AppState | IStore) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }

    this.modal = new ModalService(this.state);
  }

  decline() {
    return this.applyInviteAction("decline");
  }

  accept() {
    return this.applyInviteAction("accept");
  }

  private async applyInviteAction(action: InviteAction) {
    const { api, modalInvite } = this.state.get();

    if (!modalInvite) return;

    api.stream.sendInviteAction(modalInvite.id, action);

    //If the stream has begun already
    //else the api.strea.onStreamIdAvailable
    //will fire after the host starts the room
    if (modalInvite.stream?.id && action === "accept") {
      container.openStream?.(modalInvite.stream);
    }

    this.modal.close();
  }
}

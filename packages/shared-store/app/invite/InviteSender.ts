import { ISentInvite } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { ModalService } from "../modal";
import { StateUpdate } from "../types";

export interface InviteSender {
  addPendingInvite: (user: string) => Promise<StateUpdate>;
  cancelInvite: (user: string) => Promise<StateUpdate>;
  sendPendingInvites: () => Promise<StateUpdate>;
}

export class InviteSenderImpl implements InviteSender {
  private state: AppState;
  private modal: ModalService;

  constructor(state: AppState | IStore) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }

    this.modal = new ModalService(state);
  }

  async sendPendingInvites() {
    const { pendingInviteUserIds, api, stream } = this.state.get();

    const promises = pendingInviteUserIds.map((userToInvite: any) =>
      api.stream.invite(userToInvite, stream)
    );

    const responses = await Promise.all(promises);

    this.modal.close();

    return this.state.update({
      pendingInviteUserIds: [],
      sentInvites: responses.reduce((result, response) => {
        if (response.invite) {
          result[response.invite.id] = {
            ...response.invite,
            state: "unknown",
          };
        }

        return result;
      }, {} as Record<string, ISentInvite>),
    });
  }

  async cancelInvite(user: string) {
    const { api, sentInvites } = this.state.get();

    const sentInviteId = sentInvites[user]?.id;

    if (sentInviteId) {
      await api.stream.cancelInvite(sentInviteId);
    }

    return this.state.update((state) => {
      state.pendingInviteUserIds = state.pendingInviteUserIds.filter(
        (id) => id !== user
      );

      delete state.sentInvites[user];
    });
  }

  async addPendingInvite(user: string) {
    return this.state.update({
      pendingInviteUserIds: [...this.state.get().pendingInviteUserIds, user],
    });
  }
}

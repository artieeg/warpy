import { InviteStates, InviteSent, User } from "@warpy/lib";
import { container } from "../../container";
import { Store } from "../Store";
import { AppState } from "../AppState";
import { ModalService } from "./modal.service";
import { Service } from "../Service";

export interface InviteData {
  pendingInviteUserIds: string[];
  inviteSuggestions: User[];
  sentInvites: Record<string, InviteSent>;
}

export class InviteService extends Service<InviteData> {
  private modal: ModalService;

  constructor(state: Store | AppState) {
    super(state);

    this.modal = new ModalService(state);
  }

  getInitialState() {
    return {
      pendingInviteUserIds: [],
      inviteSuggestions: [],
      sentInvites: {},
    };
  }

  async updateStateOfSentInvite(invite: string, state: InviteStates) {
    const sentInviteData = this.state.get().sentInvites[invite];

    if (!sentInviteData) {
      throw new Error("Invite does not exist");
    }

    return this.state.update({
      sentInvites: {
        ...this.state.get().sentInvites,
        [invite]: {
          ...sentInviteData,
          state,
        },
      },
    });
  }

  decline() {
    return this.applyInviteAction("decline");
  }

  accept() {
    return this.applyInviteAction("accept");
  }

  private applyInviteAction(action: "accept" | "decline") {
    const { api, modalInvite } = this.state.get();

    if (!modalInvite) return;

    api.stream.sendInviteAction(modalInvite.id, action);

    //If the stream has begun already
    //else the api.strea.onStreamIdAvailable
    //will fire after the host starts the room
    if (modalInvite.stream?.id && action === "accept") {
      container.openStream?.(modalInvite.stream);
    }

    return this.modal.close();
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
      }, {} as Record<string, InviteSent>),
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

  async reset() {
    this.state.update({
      pendingInviteUserIds: [],
      sentInvites: {},
    });

    return this.state.getStateDiff();
  }

  async fetchInviteSuggestions(stream: string) {
    const { api } = this.state.get();
    const suggestions = await api.stream.getInviteSuggestions(stream);

    return this.state.update({
      inviteSuggestions: suggestions,
    });
  }
}

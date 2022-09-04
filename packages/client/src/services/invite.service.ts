import { InviteStates, InviteSent, User } from "@warpy/lib";
import { ModalService } from "./modal.service";
import { Service } from "../Service";
import { container } from "../container";
import { StateSetter, StateGetter } from "../types";

export interface InviteData {
  pendingInviteUserIds: string[];
  inviteSuggestions: User[];
  sentInvites: Record<string, InviteSent>;
}

export class InviteService extends Service<InviteData> {
  private modal: ModalService;

  constructor(set: StateSetter, get: StateGetter) {
    super(set, get);

    this.modal = new ModalService(set, get);
  }

  getInitialState() {
    return {
      pendingInviteUserIds: [],
      inviteSuggestions: [],
      sentInvites: {},
    };
  }

  async updateStateOfSentInvite(invite: string, state: InviteStates) {
    const sentInviteData = this.get().sentInvites[invite];

    if (!sentInviteData) {
      throw new Error("Invite does not exist");
    }

    return this.set({
      sentInvites: {
        ...this.get().sentInvites,
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
    const { api, modalInvite } = this.get();

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
    const { pendingInviteUserIds, api, stream } = this.get();

    const promises = pendingInviteUserIds.map((userToInvite: any) =>
      api.stream.invite(userToInvite, stream)
    );

    const responses = await Promise.all(promises);

    this.modal.close();

    return this.set({
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
    const { api, sentInvites } = this.get();

    const sentInviteId = sentInvites[user]?.id;

    if (sentInviteId) {
      await api.stream.cancelInvite(sentInviteId);
    }

    return this.set((state) => {
      state.pendingInviteUserIds = state.pendingInviteUserIds.filter(
        (id) => id !== user
      );

      delete state.sentInvites[user];
    });
  }

  async addPendingInvite(user: string) {
    return this.set({
      pendingInviteUserIds: [...this.get().pendingInviteUserIds, user],
    });
  }

  async reset() {
    this.set({
      pendingInviteUserIds: [],
      sentInvites: {},
    });
  }

  async fetchInviteSuggestions(stream: string) {
    const { api } = this.get();
    const { suggestions } = await api.stream.getInviteSuggestions(stream);

    return this.set({
      inviteSuggestions: suggestions,
    });
  }
}

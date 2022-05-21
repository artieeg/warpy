//import { navigation } from "@app/navigation";
import produce from "immer";
import { IInvite, InviteStates, ISentInvite } from "@warpy/lib";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";
import { container } from "../container";

export interface IInviteDispatchers {
  dispatchPendingInvite: (user: string) => void;
  dispatchCancelInvite: (user: string) => Promise<void>;
  dispatchSendPendingInvites: () => Promise<void>;
  dispatchInviteAction: (action: "accept" | "decline") => Promise<void>;
  dispatchInviteStateUpdate: (invite: string, state: InviteStates) => void;
  dispatchFetchAppInvite: () => Promise<void>;
  dispatchAppInviteUpdate: () => Promise<void>;
  dispatchInviteClear: () => Promise<void>;
}

export const createInviteDispatchers: StoreSlice<IInviteDispatchers> = (
  set,
  get
) => ({
  async dispatchAppInviteUpdate() {
    const { api } = get();

    const { invite } = await api.app_invite.refresh();

    set({
      appInvite: invite,
    });
  },

  async dispatchFetchAppInvite() {
    const { api } = get();

    const { invite: appInvite } = await api.app_invite.get(get().user!.id);

    set({
      appInvite,
    });
  },

  async dispatchInviteAction(action) {
    const { api, modalInvite } = get();

    if (!modalInvite) return;

    api.stream.sendInviteAction(modalInvite.id, action);

    //If the stream has begun already
    //else the api.strea.onStreamIdAvailable
    //will fire after the host starts the room
    if (modalInvite.stream?.id && action === "accept") {
      container.openStream?.(modalInvite.stream);
    }

    get().dispatchModalClose();
  },

  dispatchInviteStateUpdate(invite, value) {
    set(
      produce<IStore>((state) => {
        if (state.sentInvites[invite]) {
          state.sentInvites[invite] = {
            ...state.sentInvites[invite],
            state: value as any,
          };
        }
      })
    );
  },

  async dispatchSendPendingInvites() {
    const { pendingInviteUserIds, api, stream } = get();

    const promises = pendingInviteUserIds.map((userToInvite) =>
      api.stream.invite(userToInvite, stream)
    );

    const responses = await Promise.all(promises);

    set({
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

    get().dispatchModalClose();
  },

  dispatchPendingInvite(user) {
    set(
      produce<IStore>((state) => {
        state.pendingInviteUserIds.push(user);
      })
    );
  },

  async dispatchCancelInvite(user) {
    const { api, sentInvites } = get();

    const sentInviteId = sentInvites[user]?.id;

    if (sentInviteId) {
      await api.stream.cancelInvite(sentInviteId);
    }

    set(
      produce<IStore>((state) => {
        state.pendingInviteUserIds = state.pendingInviteUserIds.filter(
          (id) => id !== user
        );

        delete state.sentInvites[user];
      })
    );
  },

  async dispatchInviteClear() {
    set({
      pendingInviteUserIds: [],
      sentInvites: {},
    });
  },
});

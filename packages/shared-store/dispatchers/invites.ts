//import { navigation } from "@app/navigation";
import produce from "immer";
import { IInvite, InviteStates } from "@warpy/lib";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";

export interface IInviteDispatchers {
  dispatchPendingInvite: (user: string) => void;
  dispatchCancelInvite: (user: string) => Promise<void>;
  dispatchSendPendingInvites: () => Promise<void>;
  dispatchInviteAction: (action: "accept" | "decline") => Promise<void>;
  dispatchInviteStateUpdate: (invite: string, state: InviteStates) => void;
}

export const createInviteDispatchers: StoreSlice<IInviteDispatchers> = (
  set,
  get
) => ({
  async dispatchInviteAction(action) {
    const { api, modalInvite } = get();

    if (!modalInvite) return;

    api.stream.sendInviteAction(modalInvite.id, action);

    //If the stream had begun already
    //else the api.strea.onStreamIdAvailable
    //will fire after the host starts the room
    if (modalInvite.stream?.id && action === "accept") {
      console.log("yo fix this");
      /*
      navigation.current?.navigate("Stream", {
        stream: modalInvite.stream,
      });
      */
    }

    get().dispatchModalClose();
  },

  dispatchInviteStateUpdate(invite, value) {
    set(
      produce<IStore>((state) => {
        if (state.sentInvites[invite]) {
          state.sentInvites[invite] = {
            ...state.sentInvites[invite],
            accepted: value === "accepted",
            declined: value === "declined",
          };
        }
      })
    );
  },

  async dispatchSendPendingInvites() {
    const { pendingInviteUserIds, api, stream } = get();

    console.log(pendingInviteUserIds);

    const promises = pendingInviteUserIds.map((userToInvite) =>
      api.stream.invite(userToInvite, stream)
    );
    console.log(promises.length);

    const responses = await Promise.all(promises);

    set({
      pendingInviteUserIds: [],
      sentInvites: responses.reduce((result, response) => {
        if (response.invite) {
          result[response.invite.id] = response.invite;
        }

        return result;
      }, {} as Record<string, IInvite>),
    });
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
});

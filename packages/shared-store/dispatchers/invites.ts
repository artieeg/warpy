import { InviteStates } from "@warpy/lib";
import { StoreDispatcherSlice } from "../types";

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

export const createInviteDispatchers: StoreDispatcherSlice<IInviteDispatchers> =
  (runner, { invite, app_invite }) => ({
    async dispatchAppInviteUpdate() {
      await runner.mergeStateUpdate(app_invite.update());
    },

    async dispatchFetchAppInvite() {
      await runner.mergeStateUpdate(app_invite.get());
    },

    async dispatchInviteAction(action) {
      const update = action === "accept" ? invite.accept() : invite.decline();

      await runner.mergeStateUpdate(update);
    },

    dispatchInviteStateUpdate(inviteId, value) {
      runner.mergeStateUpdate(invite.updateStateOfSentInvite(inviteId, value));
    },

    async dispatchSendPendingInvites() {
      await runner.mergeStateUpdate(invite.sendPendingInvites());
    },

    dispatchPendingInvite(user) {
      runner.mergeStateUpdate(invite.addPendingInvite(user));
    },

    async dispatchCancelInvite(user) {
      await runner.mergeStateUpdate(invite.cancelInvite(user));
    },

    async dispatchInviteClear() {
      await runner.mergeStateUpdate(invite.reset());
    },
  });

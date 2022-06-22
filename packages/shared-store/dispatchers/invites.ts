import { InviteStates } from "@warpy/lib";
import { StoreSlice } from "../types";
import { runner } from "../useStore";
import { InviteService } from "../app/invite";
import { AppInviteService } from "../app/app-invite";

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
  _set,
  get
) => ({
  async dispatchAppInviteUpdate() {
    await runner.mergeStateUpdate(new AppInviteService(get()).update());
  },

  async dispatchFetchAppInvite() {
    await runner.mergeStateUpdate(new AppInviteService(get()).get());
  },

  async dispatchInviteAction(action) {
    const inviteService = new InviteService(get());

    const update =
      action === "accept" ? inviteService.accept() : inviteService.decline();

    await runner.mergeStateUpdate(update);
  },

  dispatchInviteStateUpdate(invite, value) {
    runner.mergeStateUpdate(
      new InviteService(get()).updateStateOfSentInvite(invite, value)
    );
  },

  async dispatchSendPendingInvites() {
    await runner.mergeStateUpdate(
      new InviteService(get()).sendPendingInvites()
    );
  },

  dispatchPendingInvite(user) {
    runner.mergeStateUpdate(new InviteService(get()).addPendingInvite(user));
  },

  async dispatchCancelInvite(user) {
    await runner.mergeStateUpdate(new InviteService(get()).cancelInvite(user));
  },

  async dispatchInviteClear() {
    await runner.mergeStateUpdate(new InviteService(get()).reset());
  },
});

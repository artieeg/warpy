import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { IBaseUser, IBot, IInvite } from "@warpy/lib";

export type OpenModalParams = {
  selectedUser?: IBaseUser;
  userToAward?: IBaseUser;
  botConfirmId?: string;
  botConfirmData?: IBot;
  invite?: IInvite;
  closeAfterReassign?: boolean;
};

export type Modal =
  | "award"
  | "host-reassign"
  | "award-message"
  | "award-visual"
  | "award-recipent"
  | "participant-info"
  | "participants"
  | "reactions"
  | "reports"
  | "invite"
  | "stream-invite"
  | "bot-confirm"
  | "chat";

export class ModalService {
  private state: AppState;

  constructor(state: AppState | IStore) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  open(modal: Modal, params?: OpenModalParams) {
    return this.state.update({
      unseenRaisedHands:
        modal === "participants" ? 0 : this.state.get().unseenRaisedHands,
      modalCurrent: modal === this.state.get().modalCurrent ? null : modal,
      modalSelectedUser: params?.selectedUser || null,
      modalBotConfirmData: params?.botConfirmData || null,
      modalBotConfirmId: params?.botConfirmId || null,
      modalUserToAward: params?.userToAward || null,
      modalInvite: params?.invite || null,
      modalCloseAfterHostReassign: !!params?.closeAfterReassign,
    });
  }

  close() {
    return this.state.update({
      modalCurrent: null,
      modalSelectedUser: null,
      modalBotConfirmId: null,
      modalBotConfirmData: null,
      modalInvite: null,
      modalCloseAfterHostReassign: false,
    });
  }
}

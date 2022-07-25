import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { UserBase, Bot, Invite } from "@warpy/lib";
import { Service } from "../Service";

export type OpenModalParams = {
  selectedUser?: UserBase;
  userToAward?: UserBase;
  botConfirmId?: string;
  botConfirmData?: Bot;
  invite?: Invite;
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
  | "send-invite"
  | "stream-invite"
  | "bot-confirm"
  | "chat";

export interface ModalData {
  modalCurrent: Modal | null;
  modalSelectedUser: UserBase | null;
  modalInvite: Invite | null;
  modalBotConfirmData: Bot | null;
  modalCloseAfterHostReassign: boolean;
  modalBotConfirmId: string | null;
  modalUserToAward: UserBase | null;
}

export class ModalService extends Service<ModalData> {
  constructor(state: AppState | IStore) {
    super(state);
  }

  getInitialState() {
    return {
      modalCurrent: null,
      modalSelectedUser: null,
      modalInvite: null,
      modalBotConfirmData: null,
      modalBotConfirmId: null,
      modalUserToAward: null,
      modalCloseAfterHostReassign: false,
    };
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

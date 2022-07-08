import { AppState } from "../AppState";
import { ModalService } from "../modal";
import { StateUpdate } from "../types";

export interface HostReassigner {
  reassign: (newHostId: string) => Promise<StateUpdate>;
}

export class HostReassignerImpl implements HostReassigner {
  private modal: ModalService;

  constructor(private state: AppState) {
    this.modal = new ModalService(this.state);
  }

  async reassign(newHostId: string) {
    const { api, modalCloseAfterHostReassign } = this.state.get();

    await api.stream.reassignHost(newHostId);

    if (modalCloseAfterHostReassign) {
      this.modal.close();
    }

    return this.state.getStateDiff();
  }
}

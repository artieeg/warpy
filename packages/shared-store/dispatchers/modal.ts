import { StoreSlice } from "../types";
import { Modal, ModalService, OpenModalParams } from "../app/modal";
import { runner } from "@app/store";

export interface IModalDispatchers {
  dispatchModalOpen: (modal: Modal, params?: OpenModalParams) => void;
  dispatchModalClose: () => void;
}

export const createModalDispatchers: StoreSlice<IModalDispatchers> = (
  _set,
  get
) => ({
  dispatchModalClose() {
    runner.mergeStateUpdate(new ModalService(get()).close());
  },
  dispatchModalOpen(modal, params) {
    runner.mergeStateUpdate(new ModalService(get()).open(modal, params));
  },
});

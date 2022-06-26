import { StoreDispatcherSlice } from "../types";
import { Modal, OpenModalParams } from "../app/modal";

export interface IModalDispatchers {
  dispatchModalOpen: (modal: Modal, params?: OpenModalParams) => void;
  dispatchModalClose: () => void;
}

export const createModalDispatchers: StoreDispatcherSlice<IModalDispatchers> = (
  runner,
  { modal }
) => ({
  dispatchModalClose() {
    runner.mergeStateUpdate(modal.close());
  },

  dispatchModalOpen(modalName, params) {
    runner.mergeStateUpdate(modal.open(modalName, params));
  },
});

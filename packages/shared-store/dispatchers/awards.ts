import { StoreSlice } from "../types";
import { IAward } from "@warpy/lib";
import produce from "immer";
import { IStore } from "../useStore";

export interface IAwardsDispatchers {
  dispatchSendAward: (
    award: string,
    recipent: string,
    message: string
  ) => Promise<void>;

  dispatchAwardDisplayQueueAppend: (award: IAward) => void;
  dispatchAwardDisplayQueueNext: () => void;
  dispatchFetchReceivedAwards: (
    user: string,
    forceRefresh?: boolean
  ) => Promise<void>;
}

export const createAwardsDispatchers: StoreSlice<IAwardsDispatchers> = (
  set,
  get
) => ({
  async dispatchFetchReceivedAwards(user, forceRefresh) {
    const { api, awards } = get();

    //Do not fetch awards again
    if (awards[user] && !forceRefresh) {
      return;
    }

    const response = await api.awards.getReceived(user);

    set(
      produce<IStore>((state) => {
        state.awards = {
          ...state.awards,
          [user]: response.awards,
        };
      })
    );
  },

  dispatchAwardDisplayQueueNext() {
    set({
      awardDisplayCurrent: get().awardDisplayCurrent + 1,
    });
  },

  dispatchAwardDisplayQueueAppend(award) {
    set({
      awardDisplayQueue: [...get().awardDisplayQueue, award],
    });
  },

  async dispatchSendAward(award, recipent, message) {
    const { status } = await get().api.awards.send(award, recipent, message);

    if (status === "error") {
      return; ///error handling
    }

    get().dispatchToastMessage(
      "Your award has been just sent, it will arrive shortly",
      "LONG"
    );

    //TODO: cleanup
    //set()

    get().dispatchModalClose();
  },
});

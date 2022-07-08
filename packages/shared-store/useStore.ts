import create, { GetState, SetState } from "zustand";
import { IAPISlice, createAPISlice } from "./slices/createAPISlice";
import { IFeedSlice, createFeedSlice } from "./slices/createFeedSlice";
import {
  IFollowingSlice,
  createFollowingSlice,
} from "./slices/createFollowingSlice";
import { IStreamSlice, createStreamSlice } from "./slices/createStreamSlice";
import { IUserSlice, createUserSlice } from "./slices/createUserSlice";
import { createMediaSlice, IMediaSlice } from "./slices/createMediaSlice";
import { createDeviceSlice, IDeviceSlice } from "./slices/createDeviceSlice";
import { createChatSlice, IChatSlice } from "./slices/createChatSlice";
import { State, UseStore } from "zustand";
import { createToastSlice, IToastSlice } from "./slices/createToastSlice";
import { createModalSlice, IModalSlice } from "./slices/createModalSlice";
import {
  createFriendFeedSlice,
  IFriendFeedSlice,
} from "./slices/createFriendFeedSlice";
import {
  IStreamCategoriesSlice,
  createStreamCategoriesSlice,
} from "./slices/createStreamCategoriesSlice";
import {
  createReactionSlice,
  IReactionSlice,
} from "./slices/createReactionSlice";
import {
  createNotificationSlice,
  INotificationSlice,
} from "./slices/createNotificationSlice";
import {
  createAudioLevelSlice,
  IAudioLevelSlice,
} from "./slices/createAudioLevelSlice";
import { createSignUpSlice, ISignUpSlice } from "./slices/createSignUpSlice";
import {
  createReactionDispatchers,
  IReactionDispatchers,
  IAwardsDispatchers,
  createAwardsDispatchers,
} from "./dispatchers";
import {
  createParticipantSlice,
  IParticipantSlice,
} from "./slices/createParticipantSlice";
import { createInviteSlice, IInviteSlice } from "./slices/createInviteSlice";
import { createUserListSlice } from "./slices/createUserListSlice";
import { createAwardsSlice, IAwardsSlice } from "./slices/createAwardsSlice";
import { container } from "./container";
import { AppActionRunner } from "./AppActionRunner";
import { AppActionDispatcher, createDispatcher } from "./dispatchers/dispatch";

interface Selectors<StoreType> {
  use: {
    [key in keyof StoreType]: () => StoreType[key];
  };
}

function createSelectorHooks<StoreType extends State>(
  store: UseStore<StoreType>
) {
  (store as any).use = {};

  Object.keys(store.getState()).forEach((key) => {
    const selector = (state: StoreType) => state[key as keyof StoreType];
    (store as any).use[key] = () => store(selector);
  });

  return store as UseStore<StoreType> & Selectors<StoreType>;
}

export interface IStore
  extends IStreamSlice,
    IStreamCategoriesSlice,
    IFeedSlice,
    IUserSlice,
    IFollowingSlice,
    IInviteSlice,
    IParticipantSlice,
    IAwardsSlice,
    IMediaSlice,
    IDeviceSlice,
    IChatSlice,
    IModalSlice,
    IReactionSlice,
    INotificationSlice,
    IFriendFeedSlice,
    IAudioLevelSlice,
    ISignUpSlice,
    IToastSlice,
    IReactionDispatchers,
    IAwardsDispatchers,
    AppActionDispatcher,
    IAPISlice {
  set: SetState<IStore>;
  get: GetState<IStore>;
}

type StoreConfig = {
  data?: Partial<IStore>;
  dependencies?: typeof container;
};

export let runner: AppActionRunner;
let state: UseStore<IStore>;

export const createNewStore = (config: StoreConfig) => {
  if (config.dependencies) {
    const { mediaDevices, openStream, saveReaction } = config.dependencies;

    container.mediaDevices = mediaDevices;
    container.openStream = openStream;
    container.saveReaction = saveReaction;
  }

  state = createSelectorHooks<IStore>(
    create<IStore>((set, get): IStore => {
      runner = new AppActionRunner(set, get);

      runner.initServices();

      return {
        ...config.data,
        ...createModalSlice(),
        ...createStreamCategoriesSlice(),
        ...createInviteSlice(),
        ...createAwardsSlice(),
        ...createAudioLevelSlice(),
        ...createStreamSlice(),
        ...createSignUpSlice(),
        ...createFeedSlice(),
        ...createAPISlice(set, get),
        ...createNotificationSlice(),
        ...createUserSlice(),
        ...createFollowingSlice(),
        ...createUserListSlice(),
        ...createMediaSlice(),
        ...createDeviceSlice(),
        ...createChatSlice(),
        ...createToastSlice(),
        ...createReactionSlice(),
        ...createParticipantSlice(),
        ...createFriendFeedSlice(),

        ...createAwardsDispatchers(),
        ...createReactionDispatchers(runner, runner.getServices()),
        ...createDispatcher(runner, runner.getServices()),
        set,
        get,
      };
    })
  );

  runner.connectServicesToStore(state);

  return state;
};

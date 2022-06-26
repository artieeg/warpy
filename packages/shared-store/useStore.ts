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
  createUserDispatchers,
  createStreamDispatchers,
  IUserDispatchers,
  IStreamDispatchers,
  IAudioLevelDispatchers,
  createAudioLevelDispatchers,
  IChatDispatchers,
  createChatDispatchers,
  IFeedDispatchers,
  createFeedDispatchers,
  IFollowingDispatchers,
  createFollowingDispatchers,
  IMediaDispatchers,
  createMediaDispatchers,
  IModalDispatchers,
  INotificaionDispatchers,
  createModalDispatchers,
  createNotificationDispatchers,
  createReactionDispatchers,
  IReactionDispatchers,
  createParticipantDispatchers,
  IParticipantDispatchers,
  IToastDispatchers,
  createToastDispatchers,
  IAwardsDispatchers,
  createAwardsDispatchers,
  IFriendFeedDispatchers,
  createFriendFeedDispatchers,
} from "./dispatchers";
import {
  createParticipantSlice,
  IParticipantSlice,
} from "./slices/createParticipantSlice";
import { createInviteSlice, IInviteSlice } from "./slices/createInviteSlice";
import {
  createInviteDispatchers,
  IInviteDispatchers,
} from "./dispatchers/invites";
import {
  createUserListSlice,
  IUserListSlice,
} from "./slices/createUserListSlice";
import {
  createUserListDispatchers,
  IUserListDispatchers,
} from "./dispatchers/user_list";
import { createAwardsSlice, IAwardsSlice } from "./slices/createAwardsSlice";
import { container } from "./container";
import { AppActionRunner } from "./AppActionRunner";

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
    IAwardsSlice,
    IMediaSlice,
    IDeviceSlice,
    IChatSlice,
    IModalSlice,
    IFeedDispatchers,
    IFollowingDispatchers,
    IStreamDispatchers,
    IUserDispatchers,
    IReactionSlice,
    INotificationSlice,
    IFriendFeedSlice,
    IAudioLevelSlice,
    ISignUpSlice,
    IToastSlice,
    IAudioLevelDispatchers,
    IChatDispatchers,
    IMediaDispatchers,
    IModalDispatchers,
    INotificaionDispatchers,
    IReactionDispatchers,
    IParticipantSlice,
    IUserListDispatchers,
    IParticipantDispatchers,
    IUserListSlice,
    IAwardsDispatchers,
    IToastDispatchers,
    IInviteDispatchers,
    IFriendFeedDispatchers,
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
        ...createUserDispatchers(runner, runner.getServices()),
        ...createInviteDispatchers(runner, runner.getServices()),
        ...createUserListDispatchers(runner, runner.getServices()),
        ...createStreamDispatchers(runner, runner.getServices()),
        ...createAudioLevelDispatchers(runner, runner.getServices()),
        ...createChatDispatchers(runner, runner.getServices()),
        ...createFeedDispatchers(runner, runner.getServices()),
        ...createFollowingDispatchers(runner, runner.getServices()),
        ...createMediaDispatchers(runner, runner.getServices()),
        ...createModalDispatchers(runner, runner.getServices()),
        ...createNotificationDispatchers(runner, runner.getServices()),
        ...createParticipantDispatchers(runner, runner.getServices()),
        ...createToastDispatchers(runner, runner.getServices()),

        ...createAwardsDispatchers(),
        ...createReactionDispatchers(runner, runner.getServices()),

        //...createFriendFeedDispatchers(set, get),
        set,
        get,
      };
    })
  );

  runner.connectServicesToStore(state);

  return state;
};

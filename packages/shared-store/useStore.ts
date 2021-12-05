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
import { createTokenSlice, ITokenSlice } from "./slices/createTokenSlice";
import { createToastSlice, IToastSlice } from "./slices/createToastSlice";
import { createModalSlice, IModalSlice } from "./slices/createModalSlice";
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
import shallow from "zustand/shallow";
import {
  createUserListSlice,
  IUserListSlice,
} from "./slices/createUserListSlice";
import {
  createUserListDispatchers,
  IUserListDispatchers,
} from "./dispatchers/user_list";
import { createAwardsSlice, IAwardsSlice } from "./slices/createAwardsSlice";
import { useCallback } from "react";
import { container } from "./container";

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
    ITokenSlice,
    IReactionSlice,
    INotificationSlice,
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
    IAPISlice {
  set: SetState<IStore>;
  get: GetState<IStore>;
}

type StoreConfig = {
  data?: Partial<IStore>;
  dependencies?: typeof container;
};

export const createNewStore = (config: StoreConfig) => {
  console.log("creaing new store");

  container.mediaDevices = config.dependencies?.mediaDevices;

  return createSelectorHooks<IStore>(
    create<IStore>((set, get): IStore => {
      return {
        ...config.data,
        ...createModalSlice(set, get),
        ...createInviteSlice(set, get),
        ...createAwardsSlice(set, get),
        ...createAudioLevelSlice(set, get),
        ...createStreamSlice(set, get),
        ...createSignUpSlice(set, get),
        ...createFeedSlice(set, get),
        ...createAPISlice(set, get),
        ...createNotificationSlice(set, get),
        ...createUserSlice(set, get),
        ...createFollowingSlice(set, get),
        ...createUserListSlice(set, get),
        ...createMediaSlice(set, get),
        ...createDeviceSlice(),
        ...createChatSlice(set, get),
        ...createTokenSlice(set, get),
        ...createToastSlice(set, get),
        ...createReactionSlice(set, get),
        ...createParticipantSlice(set, get),
        ...createUserDispatchers(set, get),
        ...createAwardsDispatchers(set, get),
        ...createInviteDispatchers(set, get),
        ...createUserListDispatchers(set, get),
        ...createStreamDispatchers(set, get),
        ...createAudioLevelDispatchers(set, get),
        ...createChatDispatchers(set, get),
        ...createFeedDispatchers(set, get),
        ...createFollowingDispatchers(set, get),
        ...createMediaDispatchers(set, get),
        ...createModalDispatchers(set, get),
        ...createNotificationDispatchers(set, get),
        ...createReactionDispatchers(set, get),
        ...createParticipantDispatchers(set, get),
        ...createToastDispatchers(set, get),
        set,
        get,
      };
    })
  );
};

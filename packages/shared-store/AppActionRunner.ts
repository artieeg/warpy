import { GetState, SetState } from "zustand";
import {
  ChatService,
  StreamService,
  MediaService,
  FeedService,
  AppInviteService,
  InviteService,
  ModalService,
  NotificationService,
  ToastService,
  UserService,
  AwardService,
  ApiService,
  Store,
  StateSetter,
  StateGetter,
} from "@warpy/client";

/**
 * Connects app layer with zustand store
 * Applies received state updates to zustand store
 *
 * Actions usually produce a single state update,
 * those are handled by mergeStateUpdate(...).
 *
 * However, some actions may produce multiple state updates
 * (toggling on and off loading indicator during api request, etc.)
 * for this kind of actions, mergeStreamedUpdates(...) is used
 *
 * */
export class AppActionRunner {
  private services:
    | ReturnType<typeof AppActionRunner.prototype._initServices>
    | undefined;

  constructor(private set: SetState<Store>, private get: GetState<Store>) {}

  private _initServices() {
    const setter: StateSetter = (state) => this.set(state as any);
    const getter: StateGetter = () => this.get();

    return {
      api: new ApiService(setter, getter),
      chat: new ChatService(setter, getter),
      stream: new StreamService(setter, getter),
      media: new MediaService(setter, getter),
      feed: new FeedService(setter, getter),
      app_invite: new AppInviteService(setter, getter),
      invite: new InviteService(setter, getter),
      modal: new ModalService(setter, getter),
      notification: new NotificationService(setter, getter),
      toast: new ToastService(setter, getter),
      user: new UserService(setter, getter),
      awards: new AwardService(setter, getter),
    };
  }

  getServices() {
    if (!this.services) {
      throw new Error("Services are not initialized");
    }

    return this.services!;
  }

  initServices(): Store {
    this.services = this._initServices();

    let initialAppState: Store = {} as any;

    Object.values(this.services).map((service) => {
      initialAppState = {
        ...initialAppState,
        ...service.getInitialState(),
      };
    });

    return initialAppState;
  }
}

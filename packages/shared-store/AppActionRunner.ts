import { GetState, PartialState, SetState, UseStore } from "zustand";
import {
  StateUpdate,
  StreamedStateUpdate,
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
    return {
      api: new ApiService(this.get()),
      chat: new ChatService(this.get()),
      stream: new StreamService(this.get()),
      media: new MediaService(this.get()),
      feed: new FeedService(this.get()),
      app_invite: new AppInviteService(this.get()),
      invite: new InviteService(this.get()),
      modal: new ModalService(this.get()),
      notification: new NotificationService(this.get()),
      toast: new ToastService(this.get()),
      user: new UserService(this.get()),
      awards: new AwardService(this.get()),
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

  private syncState(state: Store) {
    for (const key in this.services) {
      (this.services as any)[key].setState(state);
    }
  }

  connectServicesToStore(state: UseStore<Store>) {
    this.syncState(state.getState());
  }

  private async merge(stateUpdate: StateUpdate | Promise<StateUpdate>) {
    const update = await stateUpdate;

    return update as PartialState<Store>;
  }

  /**
   * Apply a singular state update,
   * sync the update with other services
   * */
  async mergeStateUpdate(update: StateUpdate | Promise<StateUpdate>) {
    const r = await this.merge(update);

    this.set(r);
    this.syncState(this.get());
  }

  /**
   * Apply multiple state updates received from AsyncGenerator,
   * sync the final state with other services
   * */
  async mergeStreamedUpdates(update: StreamedStateUpdate) {
    let { done, value } = await update.next();

    while (!done) {
      this.set(await this.merge(value));

      const result = await update.next();
      done = result.done;
      value = result.value;
    }

    this.set(await this.merge(value));
    this.syncState(this.get());
  }
}

import {GetState, SetState} from 'zustand';
import {IStore} from './useStore';

export interface IFollowingSlice {
  following: string[];
  add: (newFollowedUser: string) => void;
  remove: (unfollowedUser: string) => void;
  has: (user: string) => boolean;
}

export const createFollowingSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IFollowingSlice => ({
  following: [],
  add: newFollowedUser =>
    set(state => ({
      following: [...state.following, newFollowedUser],
    })),
  remove: unfollowedUser =>
    set(state => ({
      following: state.following.filter(id => id !== unfollowedUser),
    })),

  has: user => get().following.some(id => id === user),
});

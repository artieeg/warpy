import {useAppSelector} from '@app/store';

export const useAppUser = () => {
  return useAppSelector(state => {
    console.log(state.user);
    return [state.user.data, state.user.error];
  });
};

import {useAppSelector} from '@app/store';

export const useAppUser = () => {
  return useAppSelector(state => {
    return [state.user.data, state.user.error];
  });
};

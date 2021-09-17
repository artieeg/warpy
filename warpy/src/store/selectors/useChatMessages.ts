import {useStore} from '../useStore';

export const useChatMessages = () => {
  return useStore(state => state.messages);
};

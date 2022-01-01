import {navigation} from '@app/navigation';

/**
 * In App.tsx, we can't put <ModalProvider /> within <NavigationContainer />
 * Thus, we get and store a reference to navigation object during app's startup
 * */
export const useModalNavigation = () => {
  return navigation.current!;
};

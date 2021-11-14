import {NavigationProp, ParamListBase} from '@react-navigation/native';

//hack to avoid putting modals in the react-navigation context
export const navigation: {
  current: NavigationProp<ParamListBase> | null;
} = {current: null};

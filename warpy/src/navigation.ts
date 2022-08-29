import {NavigationProp, ParamListBase} from '@react-navigation/native';

//hack to avoid putting modals in the react-navigation context
export const navigation: {
  current: any; //NavigationProp<ParamListBase> | null;
} = {current: null};

import {useRoute} from '@react-navigation/native';

export const useRouteParamsUnsafe = () => useRoute().params as any;

export const useRouteParamUnsafe = (field: string) =>
  useRouteParamsUnsafe()[field] as string;

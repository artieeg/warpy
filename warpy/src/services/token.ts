import AsyncStorage from '@react-native-async-storage/async-storage';

export let accessToken: string;
export let refreshToken: string;

type TokenKind = 'access' | 'refresh';

export const setToken = (token: string, kind?: TokenKind) => {
  if (kind === 'refresh') {
    refreshToken = token;
  } else {
    accessToken = token;
  }
};

const getToken = async (kind: TokenKind) => {
  const token = await AsyncStorage.getItem(kind);

  if (!token) {
    throw new Error(`No ${kind} token`);
  }

  return token;
};

export const loadTokens = async () => {
  accessToken = await getToken('access');
  refreshToken = await getToken('refresh');
};

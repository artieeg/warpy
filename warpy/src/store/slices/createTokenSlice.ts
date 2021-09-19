import AsyncStorage from '@react-native-async-storage/async-storage';
import {StoreSlice} from '../types';

type TokenKind = 'access' | 'refresh';

export interface ITokenSlice {
  access: string | null;
  refresh: string | null;
  loadTokens: () => Promise<void>;
  setToken: (token: string, kind?: TokenKind) => Promise<void>;
  tokenLoadError: string | null;
}

const getToken = async (kind: TokenKind) => {
  const token = await AsyncStorage.getItem(kind);

  if (!token) {
    throw new Error(`No ${kind} token`);
  }

  return token;
};

export const createTokenSlice: StoreSlice<ITokenSlice> = set => ({
  access: null,
  refresh: null,
  tokenLoadError: null,
  loadTokens: async () => {
    try {
      const [access, refresh] = await Promise.all([
        getToken('access'),
        getToken('refresh'),
      ]);

      set({access, refresh});
    } catch (e) {
      set({
        tokenLoadError: 'Token does not exist',
      });
    }
  },
  async setToken(token: string, kind?: TokenKind) {
    if (kind === 'refresh') {
      set({refresh: token});
      await AsyncStorage.setItem('access', token);
    } else {
      set({access: token});
      await AsyncStorage.setItem('refresh', token);
    }
  },
});

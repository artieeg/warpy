import { getMockedInstance } from '@warpy-be/utils';
import { NjsDeveloperAccountStore } from './developer_account.entity';

export const mockedDeveloperAccountEntity =
  getMockedInstance<NjsDeveloperAccountStore>(NjsDeveloperAccountStore);

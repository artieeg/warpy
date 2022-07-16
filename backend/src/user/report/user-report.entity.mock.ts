import { getMockedInstance } from '@warpy-be/utils';
import { NjsUserReportStore } from './user-report.entity';

export const mockedUserReportEntity =
  getMockedInstance<NjsUserReportStore>(NjsUserReportStore);

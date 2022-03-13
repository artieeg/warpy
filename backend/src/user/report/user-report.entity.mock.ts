import { getMockedInstance } from '@warpy-be/utils';
import { UserReportEntity } from './user-report.entity';

export const mockedUserReportEntity =
  getMockedInstance<UserReportEntity>(UserReportEntity);

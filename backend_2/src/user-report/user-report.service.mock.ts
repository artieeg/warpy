import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { UserReportEntity } from './user-report.entity';
import { UserReportService } from './user-report.service';

describe('UserReport service', () => {
  let userReportService: UserReportService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(UserReportEntity)
      .useValue(mockedUserReportEntity)
      .compile();

    userReportService = m.get(UserReportEntity);
  });

  it('creates new user report', async () => {
    const reportee = '1';
    const reported = '2';
    const reason = '1';

    await userReportService.addUserReport(reported, reportee, reason);

    expect(mockedUserReportEntity).toBeCalledWith({
      reportee,
      reported,
      reason,
    });
  });
});

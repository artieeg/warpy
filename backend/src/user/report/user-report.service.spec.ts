import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { NjsUserReportStore } from './user-report.entity';
import { NjsUserReportService } from './user-report.service';
import { mockedUserReportEntity } from './user-report.entity.mock';

describe('UserReport', () => {
  let userReportService: NjsUserReportService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(NjsUserReportStore)
      .useValue(mockedUserReportEntity)
      .compile();

    userReportService = m.get(NjsUserReportService);
  });

  it('creates new user report', async () => {
    const reportee = '1';
    const reported = '2';
    const reason = '1';

    await userReportService.addUserReport(reported, reportee, reason);

    expect(mockedUserReportEntity.create).toBeCalledWith({
      reportee,
      reported,
      reason,
    });
  });
});

import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { UserReportEntity } from './user-report.entity';
import { UserReportService } from './user-report.service';
import { mockedUserReportEntity } from './user-report.entity.mock';

describe('UserReport', () => {
  let userReportService: UserReportService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(UserReportEntity)
      .useValue(mockedUserReportEntity)
      .compile();

    userReportService = m.get(UserReportService);
  });

  it('creates new user report', async () => {
    await userReportService.addUserReport('id1', 'id2', 'reason');

    expect(mockedUserReportEntity.create).toBeCalled();
  });
});

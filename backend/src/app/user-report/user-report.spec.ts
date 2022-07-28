import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_USER_REPORT_CREATED, getMockedInstance } from '@warpy-be/utils';
import { UserReportService } from './user-report.service';
import { UserReportStore } from './user-report.store';

describe('UserReport', () => {
  const userReportStore = getMockedInstance<UserReportStore>(UserReportStore);

  const events = getMockedInstance<EventEmitter2>(EventEmitter2);

  const service = new UserReportService(userReportStore as any, events as any);

  it('emits user report event', async () => {
    await service.addUserReport('user', 'reporter', 'reason');

    expect(events.emit).toBeCalledWith(EVENT_USER_REPORT_CREATED, {
      reported: 'user',
    });
  });

  it('saves user report record', async () => {
    await service.addUserReport('user', 'reporter', 'reason');

    expect(userReportStore.create).toBeCalled();
  });
});

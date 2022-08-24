import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_USER_REPORT_CREATED } from '@warpy-be/utils';
import { UserReportStore } from './user-report.store';

export class UserReportService {
  constructor(
    private userReportStore: UserReportStore,
    private events: EventEmitter2,
  ) {}

  async addUserReport(
    reported: string,
    reporter: string,
    reportReasonId: string,
  ) {
    await this.userReportStore.create({
      reportee: reporter,
      reported,
      reason: reportReasonId,
    });

    this.events.emit(EVENT_USER_REPORT_CREATED, {
      reported,
    });
  }
}

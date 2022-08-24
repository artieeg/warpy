import { Injectable, Controller, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { UserReportService, UserReportStore } from '@warpy-be/app';
import { RequestReportUser, UserReportResponse } from '@warpy/lib';
import { PrismaService, PrismaModule } from './prisma';
@Injectable()
export class NjsUserReportStore extends UserReportStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsUserReportService extends UserReportService {
  constructor(userReportStore: NjsUserReportStore, events: EventEmitter2) {
    super(userReportStore, events);
  }
}

@Controller()
export class UserReportController {
  constructor(private userReportService: NjsUserReportService) {}

  @MessagePattern('user.report')
  async onUserReport({
    reportedUserId,
    reportReasonId,
    user,
  }: RequestReportUser): Promise<UserReportResponse> {
    await this.userReportService.addUserReport(
      reportedUserId,
      user,
      reportReasonId,
    );

    return {
      reportedUser: reportedUserId,
    };
  }
}

@Module({
  imports: [PrismaModule],
  providers: [NjsUserReportService, NjsUserReportStore],
  controllers: [UserReportController],
})
export class UserReportModule {}

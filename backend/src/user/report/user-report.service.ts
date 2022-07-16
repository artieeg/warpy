import { Injectable } from '@nestjs/common';
import { UserReportService } from 'lib';

@Injectable()
export class NjsUserReportService extends UserReportService {}

import { Injectable } from '@nestjs/common';
import { UserReportStore } from 'lib';

@Injectable()
export class NjsUserReportStore extends UserReportStore {}

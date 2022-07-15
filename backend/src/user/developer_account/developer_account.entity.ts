import { Injectable } from '@nestjs/common';
import { DeveloperAccountStore } from 'lib/stores/developer-account';

@Injectable()
export class NjsDeveloperAccountStore extends DeveloperAccountStore {}

import { Controller } from '@nestjs/common';
import { HostStore } from './host.store';

@Controller()
export class HostController {
  constructor(private hostStore: HostStore) {}
}

import { Controller } from '@nestjs/common';
import {
  OnParticipantLeave,
  OnStreamEnd,
  OnUserDisconnect,
} from '@warpy-be/interfaces';
import { HostStore } from './host.store';

@Controller()
export class HostController
  implements OnUserDisconnect, OnParticipantLeave, OnStreamEnd
{
  constructor(private hostStore: HostStore) {}
}

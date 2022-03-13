import { getMockedInstance } from '@warpy-be/utils';
import { MessageService } from './message.service';

export const mockedMessageService =
  getMockedInstance<MessageService>(MessageService);

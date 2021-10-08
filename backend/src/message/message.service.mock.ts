import { getMockedInstance } from '@backend_2/utils';
import { MessageService } from './message.service';

export const mockedMessageService =
  getMockedInstance<MessageService>(MessageService);

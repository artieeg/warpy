import { NatsService } from '@backend_2/nats/nats.service';
import { mockedNatsService } from '@backend_2/nats/nats.services.mock';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let messageService: MessageService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(NatsService)
      .useValue(mockedNatsService)
      .compile();

    messageService = m.get(MessageService);
  });

  it('sends message', () => {
    const user = 'test-user';
    const msg = { test: 1 };
    const encodedMsg = new Uint8Array(120);

    mockedNatsService.jc.encode.mockReturnValueOnce(encodedMsg);

    messageService.sendMessage(user, msg);

    expect(mockedNatsService.jc.encode).toBeCalledWith(msg);
    expect(mockedNatsService.publish).toBeCalledWith(
      `reply.user.${user}`,
      encodedMsg,
    );
  });
});

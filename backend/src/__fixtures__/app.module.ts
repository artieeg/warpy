import { Test } from '@nestjs/testing';
import { appModuleImports } from '@warpy-be/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { mockedEventEmitter } from '@warpy-be/events/events.service.mock';

export const getTestModuleBuilder = async () => {
  const testModuleBuilder = Test.createTestingModule({
    imports: appModuleImports,
  })
    .overrideProvider(EventEmitter2)
    .useValue(mockedEventEmitter);

  return testModuleBuilder;
};

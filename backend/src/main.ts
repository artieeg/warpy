import { NestFactory } from '@nestjs/core';
import { NatsServer } from './nats.transporter';
import { AppModule } from './app.module';
import { ExceptionFilter } from './rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    strategy: new NatsServer(),
    logger: ['error', 'warn', 'log'],
  });

  app.startAllMicroservices();

  app.listen(3000);
}

bootstrap();

process.on('SIGTERM', () => process.exit());

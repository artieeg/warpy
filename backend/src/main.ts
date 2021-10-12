import { NestFactory } from '@nestjs/core';
import { NatsServer } from './nats.transporter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new NatsServer(),
    logger: ['error', 'warn', 'log'],
  });

  app.listen();
}

bootstrap();

process.on('SIGTERM', () => process.exit());

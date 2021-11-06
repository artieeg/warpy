import { NestFactory } from '@nestjs/core';
import { NatsServer } from './nats.transporter';
import { AppModule } from './app.module';

async function bootstrap() {
  const botsApp = await NestFactory.create(AppModule);

  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new NatsServer(),
    logger: ['error', 'warn', 'log'],
  });

  botsApp.listen(3000);
  app.listen();
}

bootstrap();

process.on('SIGTERM', () => process.exit());

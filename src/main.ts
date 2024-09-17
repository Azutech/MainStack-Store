import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger , ValidationPipe} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpLogger } from './middlewares/https-middleware';

async function bootstrap() {
  const logger = new Logger('MAIN');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));


  app.use(new HttpLogger().use);

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();

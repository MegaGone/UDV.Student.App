import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { IGlobalConfiguration } from './shared/configuration/global.configuration';
import { APIContractConfiguration } from './shared/documentation/scalar.configuration';
import { HttpExceptionFilter } from './core/presentation/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const { PORT, API_VERSION, DEBUG_MODE, SCALAR_THEME } =
    config.getOrThrow<IGlobalConfiguration>("GLOBAL");

  app.setGlobalPrefix(`api/${API_VERSION}`);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  if (DEBUG_MODE)
    APIContractConfiguration.setup(app, { version: API_VERSION, theme: SCALAR_THEME });

  await app.listen(PORT);

  console.log(`🚀 Running on: ${await app.getUrl()}/api/${API_VERSION}`);
  if (DEBUG_MODE) console.log(`📖 Documentation: ${await app.getUrl()}/api/docs`);
}

bootstrap();

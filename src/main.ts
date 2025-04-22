import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './_shared/http/http-exception.filter';
import { fDate } from './_shared/helper/date.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({});
  const helmetOptions = {
    //
  };
  app.use(helmet(helmetOptions));
  app.useGlobalPipes(
    new ValidationPipe({
      // forbidUnknownValues: true,
      whitelist: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('Starter API')
    .setDescription(
      `This is the Starter API documentation\n\n${fDate(new Date())}`,
    )
    .addTag('Starter')
    .addBearerAuth()
    .addBasicAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Starter API',
  };
  SwaggerModule.setup('doc', app, document, customOptions);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('APP_PORT') ?? 3010;
  await app.listen(PORT, () => {
    const logger = new Logger('Starter::API');
    logger.log(
      `API successfully started on port ${PORT} at ${new Date().toISOString()}`,
    );
  });
}
void bootstrap();

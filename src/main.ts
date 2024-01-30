import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  PersonalPhoneDto,
  PhoneDto,
  WorkPhoneDto,
} from './contacts/dtos/phone.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('Contacts')
    .setDescription('Contacts API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [PhoneDto, WorkPhoneDto, PersonalPhoneDto],
  });
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();

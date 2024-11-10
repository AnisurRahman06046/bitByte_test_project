import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './utils/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.port || 3000;
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ResponseInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Product Catelog Api')
    .setDescription('The product catelog api documentation')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local')
    .addServer('https://bitbyte-test-project.onrender.com', 'Production')
    .addTag('Porducts')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port, () => {
    console.log(`Api documentation - Local : http://localhost:${port}/api`);
    console.log(
      `Api documentation - Prod : https://bitbyte-test-project.onrender.com/api`,
    );
  });
}
bootstrap();

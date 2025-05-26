import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  const config = new DocumentBuilder()
    .setTitle('Qui veut-être mon associé')
    .setDescription('API publication nouveau projet')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Kích hoạt CORS cho phép Web Dashboard và Mobile App kết nối
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Sử dụng ValidationPipe toàn hệ thống để xác thực dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Cấu hình Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Sổ Tay Số Nông Dân Gia Lai - API Specs')
    .setDescription('Tài liệu đặc tả toàn bộ API hệ thống Sổ Tay Số Nông Dân Gia Lai')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Backend API is running on: http://localhost:${port}`);
  logger.log(`API Documentation is available on: http://localhost:${port}/api/docs`);
}
bootstrap();

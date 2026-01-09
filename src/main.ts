import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(
    'ENV CHECK:',
    process.env.CURRENCY_API_KEY,
  );
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currency/currency.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, CurrencyModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

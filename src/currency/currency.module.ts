import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { MongoProvider } from '../database/mongo.provider';

@Module({
  providers: [CurrencyService, MongoProvider],
  controllers: [CurrencyController],
})
export class CurrencyModule {}

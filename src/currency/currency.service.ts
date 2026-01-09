import { Injectable, Inject } from '@nestjs/common';
import { Db } from 'mongodb';
import axios from 'axios';
import { ConvertDto } from './dto/convert.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrencyService {
    private API_URL = 'https://api.freecurrencyapi.com/v1';
    private CURRENCY_LIST = 'https://api.freecurrencyapi.com/v1/currencies';
    constructor(
        private config: ConfigService,
        @Inject('MONGO_DB') private db: Db,
    ) { }
    private get apiKey() {
        return this.config.get<string>(
            'CURRENCY_API_KEY',
        );
    }
    private history() {
        return this.db.collection('currency_history');
    }

    async getRates(base: string, date?: string) {
        const isHistorical = !!date;

        const endpoint = isHistorical
            ? 'https://api.freecurrencyapi.com/v1/historical'
            : 'https://api.freecurrencyapi.com/v1/latest';

        const params: any = {
            base_currency: base,
        };

        if (isHistorical) {
            params.date = date;
        }

        const { data } = await axios.get(endpoint, {
            headers: { apikey: this.apiKey },
            params,
        });

        // ✅ ALWAYS RETURN ONLY RATES
        return isHistorical
            ? data.data[date]   // unwrap date
            : data.data;
    }


    async getLatestRates(date?: string) {
        const url = date
            ? 'https://api.freecurrencyapi.com/v1/historical'
            : 'https://api.freecurrencyapi.com/v1/latest';

        const { data } = await axios.get(url, {
            params: date ? { date } : {},
            headers: {
                apikey: this.apiKey,
            },
        });

        return data.data;
    }
    async userData(userId: string, dto: ConvertDto) {

        const record = {
            userId,
            ...dto,
            createdAt: new Date(),
        };

        await this.history().insertOne(record);
        return record;
    }

    async saveConversion(userId: string, dto: ConvertDto) {
        await this.db.collection('currency_history').insertOne({
            userId,
            ...dto,
            createdAt: new Date(),
        });

        return { success: true };
    }

    // convertWithUsdBase(
    //     amount: number,
    //     from: string,
    //     to: string,
    //     rates: Record<string, number>,
    // ) {
    //     if (!rates[from] || !rates[to]) {
    //         throw new Error('Invalid currency');
    //     }

    //     // normalize through USD
    //     const amountInUsd = amount / rates[from];
    //     const result = amountInUsd * rates[to];

    //     return Number(result.toFixed(2));
    // }

    async historyByUser(userId: string) {
        return this.history()
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();
    }
    async getCurrencies() {

        const { data } = await axios.get(
            this.CURRENCY_LIST,
            {
                headers: {
                    apikey: this.apiKey,
                },
            },
        );

        return Object.values(data.data).map(
            (c: any) => ({
                code: c.code,
                name: c.name,
                symbol: c.symbol,
            }),
        );
    }
}

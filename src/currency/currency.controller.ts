import {
    Controller,
    Post,
    Get,
    Body,
    Req,
    UseGuards,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrencyService } from './currency.service';
import { ConvertDto } from './dto/convert.dto';

@UseGuards(JwtAuthGuard)
@Controller('currency')
export class CurrencyController {
    constructor(private service: CurrencyService) { }

    @Post('save')
    convert(@Req() req, @Body() dto: ConvertDto) {
        return this.service.saveConversion(
            req.user.userId,
            dto,
        );
    }

    @Get('history')
    history(@Req() req) {
        return this.service.historyByUser(req.user.userId);
    }
    @Get('currencies')
    getCurrencies() {
        return this.service.getCurrencies();
    }
    @Get('rates')
    getRates(
        @Query('date') date: string,
        @Query('base') base: string = 'USD',
    ) {
        return this.service.getRates(base, date);
    }
}

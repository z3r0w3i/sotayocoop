import { Controller, Get, Post, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PricesService } from './prices.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('latest')
  async getLatestPrices() {
    return this.pricesService.getLatestPrices();
  }

  @Get('history')
  async getPriceHistory(
    @Query('crop_name') cropName: string,
    @Query('limit') limit?: string,
  ) {
    const limitDays = limit ? parseInt(limit, 10) : 30;
    return this.pricesService.getPriceHistory(cropName, limitDays);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('staff', 'admin', 'leader')
  async updatePrice(
    @Body('crop_name') cropName: string,
    @Body('price_min') priceMin: number,
    @Body('price_max') priceMax: number,
    @Body('source') source: string,
  ) {
    return this.pricesService.updatePrice(cropName, priceMin, priceMax, source);
  }
}

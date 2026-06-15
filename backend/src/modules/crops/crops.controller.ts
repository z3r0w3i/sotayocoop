import { Controller, Get, Post, Body, Param, UseGuards, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { CropsService } from './crops.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('api/crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  // --- Public Traceability Scanning ---
  @Get('traceability/qr/:uuid')
  async getTraceabilityInfo(@Param('uuid') uuid: string) {
    return this.cropsService.getTraceabilityInfo(uuid);
  }

  // --- Authenticated Endpoints ---
  @Post()
  @UseGuards(AuthGuard)
  async createCrop(
    @Body('land_id', ParseIntPipe) landId: number,
    @Body('name') name: string,
    @Body('variety') variety: string,
    @Body('area', ParseFloatPipe) area: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @Body('start_date') startDate: string,
  ) {
    return this.cropsService.createCrop(landId, name, variety, area, quantity, startDate);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllCrops(@Query('farmer_id') farmerId?: string) {
    const parsedFarmerId = farmerId ? parseInt(farmerId, 10) : undefined;
    return this.cropsService.findAllCrops(parsedFarmerId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneCrop(@Param('id', ParseIntPipe) id: number) {
    return this.cropsService.findOneCrop(id);
  }

  // --- Costs API ---
  @Post(':id/costs')
  @UseGuards(AuthGuard)
  async addCost(
    @Param('id', ParseIntPipe) cropId: number,
    @Body('cost_type') costType: string,
    @Body('amount', ParseFloatPipe) amount: number,
    @Body('description') description: string,
    @Body('quantity', ParseFloatPipe) quantity: number,
    @Body('unit') unit: string,
    @Body('expense_date') expenseDate: string,
  ) {
    return this.cropsService.addCost(cropId, costType, amount, description, quantity, unit, expenseDate);
  }

  @Get(':id/costs')
  @UseGuards(AuthGuard)
  async getCostsByCrop(@Param('id', ParseIntPipe) cropId: number) {
    return this.cropsService.getCostsByCrop(cropId);
  }

  // --- Harvest API ---
  @Post(':id/harvests')
  @UseGuards(AuthGuard)
  async addHarvest(
    @Param('id', ParseIntPipe) cropId: number,
    @Body('quantity', ParseFloatPipe) quantity: number,
    @Body('unit') unit: string,
    @Body('quality') quality: string,
    @Body('price_per_kg', ParseFloatPipe) pricePerKg: number,
    @Body('buyer') buyer: string,
    @Body('harvest_date') harvestDate: string,
  ) {
    return this.cropsService.addHarvest(cropId, quantity, unit, quality, pricePerKg, buyer, harvestDate);
  }

  @Get(':id/harvests')
  @UseGuards(AuthGuard)
  async getHarvestsByCrop(@Param('id', ParseIntPipe) cropId: number) {
    return this.cropsService.getHarvestsByCrop(cropId);
  }

  @Get(':id/financial-report')
  @UseGuards(AuthGuard)
  async getFinancialReport(@Param('id', ParseIntPipe) cropId: number) {
    return this.cropsService.getFinancialReport(cropId);
  }

  // --- Traceability Generation ---
  @Post(':id/traceability')
  @UseGuards(AuthGuard)
  async createTraceability(
    @Param('id', ParseIntPipe) cropId: number,
    @Body('brand_name') brandName: string,
    @Body('certificates') certificates: string[],
  ) {
    return this.cropsService.createTraceability(cropId, brandName, certificates);
  }
}

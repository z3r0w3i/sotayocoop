import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { LandsService } from './lands.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('api/lands')
@UseGuards(AuthGuard)
export class LandsController {
  constructor(private readonly landsService: LandsService) {}

  @Post()
  async create(
    @User('id') userId: string,
    @Body('farmer_id', ParseIntPipe) farmerId: number,
    @Body('name') name: string,
    @Body('area') area: number,
    @Body('land_type') landType: string,
    @Body('wkt_boundary') wktBoundary: string,
  ) {
    return this.landsService.create(farmerId, name, area, landType, wktBoundary);
  }

  @Get()
  async findAll(@Query('farmer_id') farmerId?: string) {
    const parsedFarmerId = farmerId ? parseInt(farmerId, 10) : undefined;
    return this.landsService.findAll(parsedFarmerId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.landsService.findOne(id);
  }

  @Post('import-geojson')
  async importGeoJSON(
    @User('id') userId: string,
    @Body('farmer_id', ParseIntPipe) farmerId: number,
    @Body('name') name: string,
    @Body('land_type') landType: string,
    @Body('geojson') geojson: any,
  ) {
    // geojson có thể là toàn bộ Feature hoặc Geometry
    const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;
    return this.landsService.importGeoJSON(farmerId, name, landType, geometry);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.landsService.remove(id);
  }
}

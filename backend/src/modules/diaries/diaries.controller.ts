import { Controller, Get, Post, Body, Param, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('api/diaries')
@UseGuards(AuthGuard)
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Post()
  async create(
    @User('id') userId: string,
    @Body('crop_id', ParseIntPipe) cropId: number,
    @Body('activity_type') activityType: string,
    @Body('notes') notes: string,
    @Body('gps_location') gpsLocation?: string, // Hỗ trợ WKT "POINT(x y)"
    @Body('media_urls') mediaUrls?: string[],
  ) {
    return this.diariesService.create(
      cropId,
      activityType,
      notes,
      gpsLocation || null,
      mediaUrls || [],
      userId,
    );
  }

  @Get()
  async findAll(@Query('crop_id') cropId?: string) {
    const parsedCropId = cropId ? parseInt(cropId, 10) : undefined;
    return this.diariesService.findAll(parsedCropId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.diariesService.findOne(id);
  }
}

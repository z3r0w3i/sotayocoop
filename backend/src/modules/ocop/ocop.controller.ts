import { Controller, Get, Post, Body, Param, Put, Query, UseGuards, ParseIntPipe, ParseFloatPipe, ParseBoolPipe } from '@nestjs/common';
import { OcopService } from './ocop.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/user.decorator';

@Controller('api/ocop')
export class OcopController {
  constructor(private readonly ocopService: OcopService) {}

  // --- Chợ Nông sản công khai ---
  @Get('market')
  async getMarketProducts(
    @Query('is_ocop') isOcop?: string,
    @Query('status') status?: string,
  ) {
    const filterOcop = isOcop === 'true' ? true : isOcop === 'false' ? false : undefined;
    return this.ocopService.getMarketProducts(filterOcop, status || 'approved');
  }

  // --- Đăng ký OCOP & Quản lý ---
  @Post('profiles')
  @UseGuards(AuthGuard)
  async registerOcop(
    @User('id') userId: string,
    @Body('product_name') productName: string,
    @Body('description') description: string,
    @Body('district') district: string,
    @Body('category') category: string,
  ) {
    return this.ocopService.registerOcop(userId, productName, description, district, category);
  }

  @Get('profiles')
  @UseGuards(AuthGuard)
  async getOcopProfiles(
    @Query('district') district?: string,
    @Query('status') status?: string,
  ) {
    return this.ocopService.getOcopProfiles(district, status);
  }

  @Put('profiles/:id/review')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('staff', 'leader', 'admin')
  async reviewOcop(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @Body('stars_awarded') starsAwarded?: number,
    @Body('review_notes') reviewNotes?: string,
    @Body('certificate_url') certificateUrl?: string,
  ) {
    return this.ocopService.updateOcopStatus(id, status, starsAwarded, reviewNotes, certificateUrl);
  }

  // --- Chợ Nông Sản (Đăng bán) ---
  @Post('market')
  @UseGuards(AuthGuard)
  async createMarketProduct(
    @User('id') userId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price', ParseFloatPipe) price: number,
    @Body('unit') unit: string,
    @Body('quantity', ParseFloatPipe) quantity: number,
    @Body('is_ocop', ParseBoolPipe) isOcop: boolean,
    @Body('ocop_stars') ocopStars?: number,
    @Body('media_urls') mediaUrls?: string[],
  ) {
    return this.ocopService.createMarketProduct(
      userId,
      title,
      description,
      price,
      unit,
      quantity,
      isOcop,
      ocopStars,
      mediaUrls,
    );
  }
}

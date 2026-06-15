import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/dashboard')
@UseGuards(AuthGuard, RolesGuard)
@Roles('leader', 'staff', 'admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getOverviewStats() {
    return this.dashboardService.getOverviewStats();
  }

  @Get('map-layers')
  async getMapLayers() {
    return this.dashboardService.getMapLayers();
  }
}

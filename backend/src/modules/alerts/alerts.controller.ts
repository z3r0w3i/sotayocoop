import { Controller, Get, Post, Body, Query, UseGuards, ParseFloatPipe } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/alerts')
@UseGuards(AuthGuard, RolesGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('weather')
  async getWeatherAlerts() {
    return this.alertsService.getWeatherAlerts();
  }

  @Get('diseases')
  async getDiseaseAlerts() {
    return this.alertsService.getDiseaseAlerts();
  }

  // Lấy cảnh báo dựa trên định vị GPS của nông hộ
  @Get('location')
  async getAlertsByLocation(
    @Query('lon', ParseFloatPipe) longitude: number,
    @Query('lat', ParseFloatPipe) latitude: number,
  ) {
    return this.alertsService.getAlertsByLocation(longitude, latitude);
  }

  @Post('weather')
  @Roles('staff', 'leader', 'admin')
  async createWeatherAlert(
    @Body('alert_type') alertType: string,
    @Body('description') description: string,
    @Body('severity') severity: string,
    @Body('wkt_boundary') wktBoundary: string,
    @Body('start_date') startDate: string,
    @Body('end_date') endDate: string,
  ) {
    return this.alertsService.createWeatherAlert(alertType, description, severity, wktBoundary, startDate, endDate);
  }

  @Post('diseases')
  @Roles('staff', 'leader', 'admin')
  async createDiseaseAlert(
    @Body('target_type') targetType: string,
    @Body('target_name') targetName: string,
    @Body('disease_name') diseaseName: string,
    @Body('description') description: string,
    @Body('prevention_measures') preventionMeasures: string,
    @Body('wkt_boundary') wktBoundary: string,
  ) {
    return this.alertsService.createDiseaseAlert(
      targetType,
      targetName,
      diseaseName,
      description,
      preventionMeasures,
      wktBoundary,
    );
  }
}

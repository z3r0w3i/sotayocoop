import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { LandsModule } from './modules/lands/lands.module';
import { DiariesModule } from './modules/diaries/diaries.module';
import { CropsModule } from './modules/crops/crops.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { PricesModule } from './modules/prices/prices.module';
import { AiModule } from './modules/ai/ai.module';
import { OcopModule } from './modules/ocop/ocop.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LandsModule,
    DiariesModule,
    CropsModule,
    AlertsModule,
    PricesModule,
    AiModule,
    OcopModule,
    DashboardModule,
  ],
})
export class AppModule {}

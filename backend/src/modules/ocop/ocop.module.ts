import { Module } from '@nestjs/common';
import { OcopService } from './ocop.service';
import { OcopController } from './ocop.controller';

@Module({
  controllers: [OcopController],
  providers: [OcopService],
  exports: [OcopService],
})
export class OcopModule {}

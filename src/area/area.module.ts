import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AreaController } from './area.controller';
import { areaProviders } from './area.providers';
import { AreaRepository } from './area.repository';
import { AreaService } from './area.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AreaController],
  providers: [AreaService, AreaRepository, ...areaProviders],
  exports: [AreaService],
})
export class AreaModule {}

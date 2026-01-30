import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PropertiesModule } from './properties/properties.module';
import { HealthModule } from './health/health.module';
import { BuildingsModule } from './buildings/buildings.module.js';

@Module({
  imports: [
    DatabaseModule,
    PropertiesModule,
    HealthModule,
    BuildingsModule,
  ],
})
export class AppModule {}

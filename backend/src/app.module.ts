import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PropertiesModule } from './properties/properties.module';
import { HealthModule } from './health/health.module';
import { BuildingsModule } from './buildings/buildings.module.js';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [
    DatabaseModule,
    PropertiesModule,
    HealthModule,
    BuildingsModule,
    OwnersModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { BuildingsController } from './buildings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BuildingsController],
})
export class BuildingsModule {}

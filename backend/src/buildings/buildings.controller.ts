import { Controller, Post, Param } from '@nestjs/common';

@Controller()
export class BuildingsController {
  @Post('properties/:propertyId/buildings')
  create(@Param('propertyId') propertyId: string) {
    return { propertyId };
  }
}

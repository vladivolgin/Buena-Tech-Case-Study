import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('properties/:propertyId/buildings')
export class BuildingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Param('propertyId') propertyId: string) {
    return this.prisma.building.findMany({
      where: { propertyId },
      orderBy: { orderIndex: 'asc' },
      include: {
        units: {
          orderBy: { number: 'asc' },
        },
      },
    });
  }

  @Post()
  async create(
    @Param('propertyId') propertyId: string,
    @Body() body: any,
  ) {
    return this.prisma.building.create({
      data: {
        propertyId,
        street: body.street,
        houseNumber: body.houseNumber,
        postalCode: body.postalCode ?? null,
        city: body.city ?? null,
        constructionYear: body.constructionYear ?? null,
        orderIndex: body.orderIndex ?? 0,
      },
    });
  }
}

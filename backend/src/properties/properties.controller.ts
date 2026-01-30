import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from './property.entity';
import { PropertyListItemResponseDto } from './dto/property-list-item.response.dto';
import { CreatePropertyDto } from './dto/create-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(@Body() body: CreatePropertyDto): Promise<Property> {
    return this.propertiesService.create(body);
  }

  @Get()
  findAll(): Promise<PropertyListItemResponseDto[]> {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() body: Partial<Property>,
  ): Promise<Property> {
    return this.propertiesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.propertiesService.remove(id);
  }
}
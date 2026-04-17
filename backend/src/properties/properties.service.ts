import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property, ManagementType } from './property.entity';
import { PropertyListItemResponseDto } from './dto/property-list-item.response.dto';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  create(dto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      uniqueNumber: dto.uniqueNumber,
      name: dto.name,
      managementType: dto.managementType ?? ManagementType.WEG,
    });

    return this.propertyRepository.save(property);
  }

  async findAll(): Promise<PropertyListItemResponseDto[]> {
    const properties = await this.propertyRepository.find();

    return properties.map((property) => ({
      id: property.id,
      uniqueNumber: property.uniqueNumber,
      name: property.name,
      managementType: property.managementType,
      managerName: property.managerId,
      accountantName: property.accountantId,
    }));
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, data);
    return this.propertyRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Property not found');
    }
  }
}

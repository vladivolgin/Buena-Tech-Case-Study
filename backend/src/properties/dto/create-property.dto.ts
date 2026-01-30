import { ManagementType } from '../property.entity';

export class CreatePropertyDto {
  name!: string;
  managementType?: ManagementType;
}

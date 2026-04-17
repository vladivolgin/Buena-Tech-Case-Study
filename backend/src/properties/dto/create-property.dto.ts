import { ManagementType } from '../property.entity';

export class CreatePropertyDto {
  uniqueNumber!: string;
  name!: string;
  managementType?: ManagementType;
}

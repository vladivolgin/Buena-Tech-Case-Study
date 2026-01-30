import { ManagementType, PropertyStatus } from '../property.entity';

export class PropertyListItemResponseDto {
  id!: string;
  name!: string;
  managementType!: ManagementType;
  status!: PropertyStatus;
  managerName!: string | null;
  accountantName!: string | null;
}

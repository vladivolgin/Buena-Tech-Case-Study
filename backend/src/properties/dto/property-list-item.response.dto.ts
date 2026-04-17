import { ManagementType } from '../property.entity';

export class PropertyListItemResponseDto {
  id!: string;
  name!: string;
  managementType!: ManagementType;
  managerName!: string | null;
  accountantName!: string | null;
}



export class PropertyListItemResponseDto {
    id!: string;
    name!: string;
    managementType!: 'WEG' | 'MV';
    status!: 'draft' | 'active';
    managerName!: string | null;
    accountantName!: string | null;
  }
  

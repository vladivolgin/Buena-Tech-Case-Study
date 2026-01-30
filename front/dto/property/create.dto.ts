import { ManagementType } from "@/enums/managmentType";

export interface PropertyCreateDTO {
  name: string;
  managementType: ManagementType | null;
  managerId?: string | null;
  accountantId?: string | null;
  file?: File | string | null;
}

export interface PropertyUpdateDTO {
  name?: string;
  managementType?: ManagementType;
  managerId?: string | null;
  accountantId?: string | null;
  file?: File | null;
}


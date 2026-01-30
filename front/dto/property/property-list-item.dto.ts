
import { ManagementType } from "@/enums/managmentType";

export interface PropertyListItemDto {
  id: string;
  name: string;
  managementType: ManagementType;
  status: "draft" | "active";
  managerName?: string | null;
  accountantName?: string | null;
}


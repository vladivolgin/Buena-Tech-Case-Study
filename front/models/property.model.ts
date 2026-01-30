export type PropertyStatus = "draft" | "active";

export interface Property {
  id: string;
  name: string;
  managementType: "WEG" | "MV";
  status: "draft" | "active";

  managerId?: string | null;
  accountantId?: string | null;

  buildingsCount?: number;
  unitsCount?: number;
}
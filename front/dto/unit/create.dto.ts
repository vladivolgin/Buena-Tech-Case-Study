import { TypeUnit } from "@/enums/typeUnit";

export interface UnitCreateDTO {
  buildingId: string;
  unitNumber: string;
  unitType: TypeUnit | null;
  floor: string;
  areaSqm: string;
  entrance: string;
  rooms: string;
  yearBuilt: string;
  ownershipShare: string;
}

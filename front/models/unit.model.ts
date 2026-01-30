import { TypeUnit } from "@/enums/typeUnit";

interface Unit {
  id: string;
  propertyId: string;
  buildingId: string;
  unitNumber: number;
  unitType: TypeUnit;
  floor: number;
  areaSqm: number;
  entrance: string;
  rooms: number;
  yearBuilt: number;
  ownershipShare: number;
  createdAt: string;
}

export type Units = Unit[];

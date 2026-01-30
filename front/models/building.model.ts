import { Units } from "./unit.model";

interface Building {
  id: string;
  propertyId: string;
  street: string;
  houseNumber: number;
  postalCode: number;
  city: string;
  yearBuilt: number;
  createdAt: string;
  units: Units | null;
}

export type Buildings = Building[];

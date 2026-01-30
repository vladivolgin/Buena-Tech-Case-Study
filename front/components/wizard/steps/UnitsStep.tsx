"use client";

import { BuildingCreateDTO } from "@/dto/building/create.dto";
import { UnitCreateDTO } from "@/dto/unit/create.dto";
import { TypeUnit } from "@/enums/typeUnit";
import { Box, Button, Field, Input, NativeSelect, Stack, SimpleGrid } from "@chakra-ui/react";

type Props = {
  buildings: BuildingCreateDTO[];
  units: UnitCreateDTO[];
  onChange: (value: UnitCreateDTO[]) => void;
};

export default function UnitsStep({ buildings, units, onChange }: Props) {
  const addUnit = () => {
    onChange([
      ...units,
      {
        buildingId: "",
        unitNumber: "",
        unitType: null,
        floor: "",
        areaSqm: "",
        entrance: "",
        rooms: "",
        yearBuilt: "",
        ownershipShare: "",
      },
    ]);
  };

  const updateUnit = <K extends keyof UnitCreateDTO>(
    index: number,
    attr: K,
    value: UnitCreateDTO[K],
  ) => {
    const next = [...units];
    next[index] = {
      ...next[index],
      [attr]: value,
    };
    onChange(next);
  };

  return (
    <Box>
      <Stack gap="6">
        {units.map((unit, index) => (
          <Box key={index} p="4" borderWidth="1px" rounded="md">
            <SimpleGrid columns={2} gap="4">
              <Field.Root required>
                <Field.Label>Building</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={unit.buildingId}
                    placeholder="Select building"
                    onChange={(e) => updateUnit(index, "buildingId", e.target.value)}
                  >
                    {buildings.map((building, i) => (
                      <option key={i} value={building.tempId}>
                        {building.city} - {building.street} {building.houseNumber}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root required>
                <Field.Label>Unit type</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    placeholder="Select option"
                    onChange={(e) => updateUnit(index, "unitType", e.target.value)}
                  >
                    <option value={TypeUnit.Apartament}>{TypeUnit.Apartament}</option>
                    <option value={TypeUnit.Garden}>{TypeUnit.Garden}</option>
                    <option value={TypeUnit.Office}>{TypeUnit.Office}</option>
                    <option value={TypeUnit.Parking}>{TypeUnit.Parking}</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>


              <Field.Root required>
                <Field.Label>Size (m²)</Field.Label>
                <Input
                  type="number"
                  placeholder="e.g. 120"
                  value={unit.areaSqm}
                  onChange={(e) => updateUnit(index, "areaSqm", e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Construction year</Field.Label>
                <Input
                  type="number"
                  placeholder="2025"
                  value={unit.yearBuilt}
                  onChange={(e) => updateUnit(index, "yearBuilt", e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Floor</Field.Label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={unit.floor}
                  onChange={(e) => updateUnit(index, "floor", e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Ownership share (%)</Field.Label>
                <Input
                  type="number"
                  placeholder="e.g. 50%"
                  value={unit.ownershipShare}
                  onChange={(e) => updateUnit(index, "ownershipShare", e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Rooms</Field.Label>
                <Input
                  type="number"
                  placeholder="2"
                  value={unit.rooms}
                  onChange={(e) => updateUnit(index, "rooms", e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Entrance</Field.Label>
                <Input
                  placeholder="e.g. Libauer str"
                  value={unit.entrance}
                  onChange={(e) => updateUnit(index, "entrance", e.target.value)}
                />
              </Field.Root>
            </SimpleGrid>
          </Box>
        ))}

        <Button onClick={addUnit} variant="outline" alignSelf="flex-start">
          + Add unit
        </Button>
      </Stack>
    </Box>
  );
}

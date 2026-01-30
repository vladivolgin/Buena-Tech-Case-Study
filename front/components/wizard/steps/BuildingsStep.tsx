import { Box, Button, Field, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { BuildingCreateDTO } from "@/dto/building/create.dto";

type Props = {
  buildings: BuildingCreateDTO[];
  onChange: (value: BuildingCreateDTO[]) => void;
};

export default function BuildingsStep({ buildings, onChange }: Props) {
  const addBuild = () => {
    onChange([
      ...buildings,
      {
        tempId: crypto.randomUUID(),
        houseNumber: "",
        city: "",
        postalCode: "",
        street: "",
        yearBuilt: "",
      },
    ]);
  };

  const updateBuilding = <K extends keyof BuildingCreateDTO>(
    index: number,
    attr: K,
    value: BuildingCreateDTO[K],
  ) => {
    const next = [...buildings];
    next[index] = {
      ...next[index],
      [attr]: value,
    };
    onChange(next);
  };

  return (
    <Box>
      <Stack gap="5">
        {buildings.map((building, index) => (
          <Box key={index} p="4" borderWidth="1px" rounded="md">
            <SimpleGrid columns={2} gap="4">
              <Field.Root required>
                <Field.Label>Enter city</Field.Label>
                <Input
                  value={building.city}
                  placeholder="Frankfurt"
                  onChange={(e) => updateBuilding(index, "city", e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Enter street</Field.Label>
                <Input
                  value={building.street}
                  placeholder="Warshauer str."
                  onChange={(e) => updateBuilding(index, "street", e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>House number</Field.Label>
                <Input
                  value={building.houseNumber}
                  placeholder="11"
                  onChange={(e) => updateBuilding(index, "houseNumber", e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Postal code</Field.Label>
                <Input
                  value={building.postalCode}
                  placeholder="10245"
                  onChange={(e) => updateBuilding(index, "postalCode", e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Enter year built</Field.Label>
                <Input
                  value={building.yearBuilt}
                  placeholder="2000"
                  onChange={(e) => updateBuilding(index, "yearBuilt", e.target.value)}
                />
              </Field.Root>
            </SimpleGrid>
          </Box>
        ))}

        <Button onClick={addBuild} variant="outline" alignSelf="flex-start">
          + Add address
        </Button>
      </Stack>
    </Box>
  );
}

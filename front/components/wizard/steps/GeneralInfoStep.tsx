"use client";

import { PropertyCreateDTO } from "@/dto/property/create.dto";
import { ManagementType } from "@/enums/managmentType";
import { Box, Field, Input, NativeSelect, Stack } from "@chakra-ui/react";

interface Props {
  readonly property: PropertyCreateDTO;
  readonly onChange: (value: PropertyCreateDTO) => void;
}

type PropertyFormValues = PropertyCreateDTO;
type PropertyFormKey = keyof PropertyFormValues;

export default function GeneralInfoStep({ property, onChange }: Props) {
  const changeProperty = <K extends PropertyFormKey>(
    attr: K,
    value: PropertyFormValues[K],
  ) => {
    onChange({
      ...property,
      [attr]: value,
    });
  };
  return (
    <Box>
      <Stack gap="5">
        <Field.Root required>
          <Field.Label>Name</Field.Label>
          <Input
            placeholder="Enter name"
            value={property.name}
            onChange={(e) => changeProperty("name", e.target.value)}
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Management type</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder="Select option"
              value={property.managementType ?? ""}
              onChange={(e) =>
                changeProperty(
                  "managementType",
                  e.target.value === ""
                    ? null
                    : (e.target.value as ManagementType),
                )
              }
            >
              <option value={ManagementType.MV}>{ManagementType.MV}</option>
              <option value={ManagementType.WEG}>{ManagementType.WEG}</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label>Manager</Field.Label>
          <Input
            placeholder="Manager name"
            value={property.managerId ?? ""}
            onChange={(e) =>
              changeProperty("managerId", e.target.value ? e.target.value : null)
            }
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Accountant</Field.Label>
          <Input
            placeholder="Accountant name"
            value={property.accountantId ?? ""}
            onChange={(e) =>
              changeProperty(
                "accountantId",
                e.target.value ? e.target.value : null,
              )
            }
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>File</Field.Label>
          <Input type="file" onChange={(e) => changeProperty("file", e.target.value)} />
        </Field.Root>
      </Stack>
    </Box>
  );
}

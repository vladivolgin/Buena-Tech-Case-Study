"use client";

import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  Button,
  Text,
  Badge,
  Flex,
  Stack,
  Grid,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PropertyListItemDto } from "@/dto/property/property-list-item.dto";


interface Props {
  property: PropertyListItemDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <Grid templateColumns="160px 1fr" gap="2">
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text fontWeight="medium">
      {value !== null && value !== undefined ? value : "—"}
    </Text>
  </Grid>
);

export default function PropertyDetailsDialog({
  property,
  isOpen,
  onClose,
}: Props) {
  const router = useRouter();

  if (!property) return null;

  const handleContinue = () => {
    onClose();
    router.push(
      property.status === "draft"
        ? `/properties/${property.id}/wizard`
        : `/properties/${property.id}`
    );
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
    >
      <DialogContent maxW="xl">
        <DialogHeader>
          <DialogTitle>{property.name}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody>
          <Stack gap="6">
            {/* Badges */}
            <Flex gap="2">
              <Badge
                bg={
                  property.managementType === "WEG"
                    ? "green.500"
                    : "blue.500"
                }
                color="white"
                rounded="full"
                px="3"
                py="1"
                fontSize="0.75rem"
              >
                {property.managementType}
              </Badge>

              <Badge
                bg={
                  property.status === "active"
                    ? "green.400"
                    : "yellow.400"
                }
                color="black"
                rounded="full"
                px="3"
                py="1"
                fontSize="0.75rem"
              >
                {property.status}
              </Badge>
            </Flex>

            {/* Management */}
            <Stack gap="4">
              <InfoRow
                label="Manager"
                value={property.managerName}
              />
              <InfoRow
                label="Accountant"
                value={property.accountantName}
              />
            </Stack>

            {/* Draft hint */}
            {property.status === "draft" && (
              <Text fontSize="sm" color="gray.500">
                This property is still in draft status.
                Complete the wizard to activate it.
              </Text>
            )}
          </Stack>
        </DialogBody>

        <DialogFooter gap="3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              router.push(`/properties/${property.id}`)
            }
          >
            Open full view
          </Button>

          <Button colorScheme="blue" onClick={handleContinue}>
            {property.status === "draft"
              ? "Continue wizard"
              : "Open property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}


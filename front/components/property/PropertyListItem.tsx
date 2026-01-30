"use client";

import {
  Box,
  Text,
  Flex,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { PropertyListItemDto } from "@/dto/property/property-list-item.dto";
import PropertyDetailsDialog from "./PropertyDetailsDialog";


type Props = {
  property: PropertyListItemDto;
};

const MANAGEMENT_TYPE_STYLES = {
  WEG: {
    bg: "green.500",
    color: "white",
    boxShadow: "0 4px 10px rgba(34, 197, 94, 0.35)",
  },
  MV: {
    bg: "blue.500",
    color: "white",
    boxShadow: "0 4px 10px rgba(59, 130, 246, 0.35)",
  },
} as const;

export default function PropertyListItem({ property }: Props) {
  const { open, onOpen, onClose } = useDisclosure();

  const typeStyle =
    MANAGEMENT_TYPE_STYLES[
      property.managementType as keyof typeof MANAGEMENT_TYPE_STYLES
    ];

  return (
    <>
      {/* CARD */}
      <Box
        role="group"
        rounded="xl"
        borderWidth="1px"
        p="6"
        minH="150px"
        cursor="pointer"
        transition="all 0.2s ease"
        _hover={{
          shadow: "md",
          transform: "translateY(-2px)",
          borderColor: "gray.300",
        }}
        onClick={onOpen}
      >
        {/* Property name */}
        <Text fontSize="lg" fontWeight="semibold" mb="3">
          {property.name}
        </Text>

        {/* Badges */}
        <Flex gap="2" flexWrap="wrap" mb="4">
          {/* MANAGEMENT TYPE */}
          <Badge
            bg={typeStyle.bg}
            color={typeStyle.color}
            rounded="full"
            fontSize="0.75rem"
            px="3"
            py="1"
            boxShadow={typeStyle.boxShadow}
            letterSpacing="0.02em"
          >
            {property.managementType}
          </Badge>

          {/* STATUS */}
          <Badge
            bg="yellow.400"
            color="black"
            rounded="full"
            fontSize="0.75rem"
            px="3"
            py="1"
          >
            {property.status}
          </Badge>
        </Flex>

        {/* CTA */}
        <Text
          fontSize="sm"
          color="gray.400"
          _groupHover={{ color: "gray.600" }}
        >
          View details →
        </Text>
      </Box>

      {/* DIALOG */}
      <PropertyDetailsDialog
        property={property}
        isOpen={open}
        onClose={onClose}
      />
    </>
  );
}

"use client";

import { Grid, Input, Stack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import PropertyListItem from "./PropertyListItem";
import PropertyService from "@/services/property.service";
import { PropertyListItemDto } from "@/dto/property/property-list-item.dto";

export default function PropertyList() {
  const [properties, setProperties] = useState<PropertyListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    PropertyService.getAll()
      .then(setProperties)
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, []);
  const filteredProperties = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return properties;

    return properties.filter((property) => {
      const name = property.name.toLowerCase();
      const managerName = property.managerName?.toLowerCase() ?? "";
      const accountantName = property.accountantName?.toLowerCase() ?? "";

      return (
        name.includes(normalizedQuery) ||
        managerName.includes(normalizedQuery) ||
        accountantName.includes(normalizedQuery)
      );
    });
  }, [properties, searchQuery]);

  if (loading) return <div>Loading...</div>;

  return (
    <Stack spacing="6">
      <Input
        placeholder="Search property"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      {filteredProperties.length > 0 ? (
        <Grid templateColumns="repeat(4, 1fr)" gap="6">
          {filteredProperties.map((property) => (
            <PropertyListItem key={property.id} property={property} />
          ))}
        </Grid>
      ) : (
        <div>No properties found.</div>
      )}
    </Stack>
  );
}

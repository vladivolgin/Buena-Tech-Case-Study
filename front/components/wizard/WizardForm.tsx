"use client";
import PropertyService from "@/services/property.service";
import { AxiosError } from "axios";
import { Box, Button, Flex, Steps, Container, Text } from "@chakra-ui/react";
import BuildingsStep from "./steps/BuildingsStep";
import GeneralInfoStep from "./steps/GeneralInfoStep";
import UnitsStep from "./steps/UnitsStep";
import { useEffect, useRef, useState } from "react";
import { PropertyCreateDTO } from "@/dto/property/create.dto";
import { BuildingCreateDTO } from "@/dto/building/create.dto";
import { UnitCreateDTO } from "@/dto/unit/create.dto";
import { useRouter } from "next/navigation";

export default function WizardForm() {
  const router = useRouter();
  const [property, setProperty] = useState<PropertyCreateDTO>({
    name: "",
    managementType: null,
    managerId: null,
    accountantId: null,
  });
  const [buildings, setBuildings] = useState<BuildingCreateDTO[]>([]);
  const [units, setUnits] = useState<UnitCreateDTO[]>([]);
  const [step, setStep] = useState(0);
  const [draftPropertyId, setDraftPropertyId] = useState<string | null>(null);
  const draftSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedRef = useRef<{
    name: string;
    managementType: PropertyCreateDTO["managementType"];
    managerId: PropertyCreateDTO["managerId"];
    accountantId: PropertyCreateDTO["accountantId"];
  } | null>(null);
  const steps = [
    {
      title: "General info",
      component: <GeneralInfoStep property={property} onChange={setProperty} />,
    },
    {
      title: "Buildings",
      component: <BuildingsStep buildings={buildings} onChange={setBuildings} />,
    },
    {
      title: "Units",
      component: <UnitsStep buildings={buildings} units={units} onChange={setUnits} />,
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedName = property.name.trim();
    const nextSnapshot = {
      name: trimmedName,
      managementType: property.managementType,
      managerId: property.managerId ?? null,
      accountantId: property.accountantId ?? null,
    };

    if (
      lastSyncedRef.current &&
      lastSyncedRef.current.name === nextSnapshot.name &&
      lastSyncedRef.current.managementType === nextSnapshot.managementType &&
      lastSyncedRef.current.managerId === nextSnapshot.managerId &&
      lastSyncedRef.current.accountantId === nextSnapshot.accountantId
    ) {
      return;
    }

    if (
      !trimmedName &&
      property.managementType === null &&
      !property.managerId &&
      !property.accountantId
    ) {
      return;
    }

    if (draftSyncTimeoutRef.current) {
      clearTimeout(draftSyncTimeoutRef.current);
    }

    draftSyncTimeoutRef.current = setTimeout(async () => {
      const nameToPersist = trimmedName || "Untitled property";

      try {
        if (!draftPropertyId) {
          const createdProperty = await PropertyService.create({
            name: nameToPersist,
            managementType: property.managementType,
            managerId: property.managerId ?? null,
            accountantId: property.accountantId ?? null,
          });

          lastSyncedRef.current = nextSnapshot;
          setDraftPropertyId(createdProperty.id);
          return;
        }

        await PropertyService.update(draftPropertyId, {
          name: nameToPersist,
          managementType: property.managementType ?? undefined,
          managerId: property.managerId ?? null,
          accountantId: property.accountantId ?? null,
        });
        lastSyncedRef.current = nextSnapshot;
      } catch (err) {
        console.error("❌ Failed to sync property draft", err);
      }
    }, 400);

    return () => {
      if (draftSyncTimeoutRef.current) {
        clearTimeout(draftSyncTimeoutRef.current);
      }
    };
  }, [
    property.name,
    property.managementType,
    property.managerId,
    property.accountantId,
    draftPropertyId,
  ]);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      setIsSubmitting(true);
      setError(null);
  
      const trimmedName = property.name.trim();
      const payload: PropertyCreateDTO = {
        name: trimmedName || "Untitled property",
        managementType: property.managementType,
        managerId: property.managerId ?? null,
        accountantId: property.accountantId ?? null,
      };

      if (draftPropertyId) {
        console.log("📤 Updating property with payload:", payload);
        await PropertyService.update(draftPropertyId, {
          name: payload.name,
          managementType: payload.managementType ?? undefined,
          managerId: payload.managerId ?? null,
          accountantId: payload.accountantId ?? null,
        });
      } else {
        console.log("📤 Creating property with payload:", payload);
        await PropertyService.create(payload);
      }

      console.log("✅ Property saved");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("❌ Failed to save property", err);
  
      const axiosError = err instanceof AxiosError ? err : null;
      const serverMessage = axiosError?.response?.data?.message;
      if (typeof serverMessage === "string" && serverMessage.length > 0) {
        setError(serverMessage);
      } else {
        setError("Failed to save property");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  
  

  return (
    <Flex minH="100vh" align="flex-start" justify="center" pt="16">
      <Container maxW="2xl">
        <Box rounded="xl" shadow="lg" p={{ base: 6, md: 8 }}>
          <form onSubmit={handleSubmit}>
            <Steps.Root
              defaultStep={0}
              count={steps.length}
              onStepChange={(details) => setStep(details.step)}
            >
              <Steps.List justifyContent="space-between" mb="8">
                {steps.map((step, index) => (
                  <Steps.Item key={step.title} index={index}>
                    <Steps.Indicator />
                    <Steps.Title fontSize="sm" fontWeight="medium">
                      {step.title}
                    </Steps.Title>
                    <Steps.Separator />
                  </Steps.Item>
                ))}
              </Steps.List>

              <Box minH="260px">
                {steps.map((step, index) => (
                  <Steps.Content key={step.title} index={index}>
                    {step.component}
                  </Steps.Content>
                ))}

                <Steps.CompletedContent textAlign="center" fontWeight="medium">
                  🎉 All steps are complete!
                </Steps.CompletedContent>
              </Box>

              {error && (
                <Text mt="4" color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}

              <Flex justify="space-between" mt="10">
                <Steps.PrevTrigger asChild>
                  <Button variant="ghost" type="button">
                    Back
                  </Button>
                </Steps.PrevTrigger>

                {step === steps.length - 1 ? (
                  <Button colorScheme="blue" type="submit" loading={isSubmitting}>
                    Submit
                  </Button>
                ) : (
                  <Steps.NextTrigger asChild>
                    <Button colorScheme="blue" type="button">
                      Continue
                    </Button>
                  </Steps.NextTrigger>
                )}
              </Flex>
            </Steps.Root>
          </form>
        </Box>
      </Container>
    </Flex>
  );
}

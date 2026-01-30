import { Box, Button, Container, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { RiFilterLine } from "react-icons/ri";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box position="sticky" top="0" zIndex="50">
        <Container maxW="container.xl" py="3">
          <Flex align="center" gap="3" flexWrap={{ base: "wrap", md: "nowrap" }}>
            <Button variant="outline" rounded="lg">
              <RiFilterLine size={18} />
            </Button>

            <Link href="/properties/create">
              <Button colorScheme="blue" rounded="lg">
                Create property
              </Button>
            </Link>
          </Flex>
        </Container>
      </Box>

      <Container>
        <div>{children}</div>
      </Container>
    </>
  );
}

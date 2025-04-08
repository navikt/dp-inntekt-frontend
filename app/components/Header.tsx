import { BodyShort, Box, HStack } from "@navikt/ds-react";
import { NavLogoIkon } from "./Ikoner/NavLogoIkon";

export function Header() {
  return (
    <Box
      background="surface-default"
      padding="6"
      borderRadius="xlarge"
      borderColor="border-subtle"
      borderWidth="1"
    >
      <HStack gap="3">
        <NavLogoIkon /> <BodyShort weight="semibold">Dagpenger inntekt</BodyShort>
      </HStack>
    </Box>
  );
}

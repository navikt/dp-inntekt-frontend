import { BodyShort, Box, Button, HStack, Spacer } from "@navikt/ds-react";
import { KvinneIkon } from "./Ikoner/KvinneIkon";

interface IProps {
  navn: string;
  pnr: string;
  sistOppdatert: string;
}

export function Personalia({ navn, pnr, sistOppdatert }: IProps) {
  return (
    <Box
      background="surface-default"
      padding="6"
      borderRadius="xlarge"
      borderColor="border-subtle"
      borderWidth="1"
    >
      <HStack gap="3" wrap={false} align="center">
        <KvinneIkon />
        <HStack gap="4">
          <BodyShort weight="semibold">{navn}</BodyShort>
          <BodyShort>/</BodyShort>
          <BodyShort>{pnr}</BodyShort>
        </HStack>
        <Spacer />
        <HStack gap="3" align="center">
          <BodyShort size="small">{`Sist oppdatert: ${sistOppdatert}`}</BodyShort>
          <Button variant="secondary" size="small">
            Hent inntekter på nytt
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

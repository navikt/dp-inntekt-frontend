import { BodyShort, Box, Button, CopyButton, HStack, Spacer } from "@navikt/ds-react";
import { KvinneIkon } from "./Ikoner/KvinneIkon";
import type { IMottaker } from "~/types/inntekt.types";

interface IProps {
  mottaker: IMottaker;
}

export function Personalia({ mottaker }: IProps) {
  // Todo: Finn ut om vi har denne data
  const sisteOppdatert = "21.03.2025, kl 12:04";

  return (
    <Box background="surface-default" padding="4" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" wrap={false} align="center">
        <KvinneIkon />
        <HStack gap="4" align="center">
          <BodyShort weight="semibold">{mottaker.navn}</BodyShort>
          <BodyShort>/</BodyShort>
          <HStack align="center">
            <BodyShort>{mottaker.pnr}</BodyShort>
            <CopyButton copyText={mottaker.pnr} />
          </HStack>
        </HStack>
        <Spacer />
        <HStack gap="4" align="center">
          <BodyShort size="small">{`Sist oppdatert: ${sisteOppdatert}`}</BodyShort>
          <Button variant="secondary" size="small">
            Hent inntekter på nytt
          </Button>
          <Button variant="primary" size="small">
            Lukk vindu
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

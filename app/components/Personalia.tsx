import { BodyShort, Box, Button, HStack, Spacer } from "@navikt/ds-react";
import type { IMottaker } from "~/types/inntekt.types";
import { erEnKvinne } from "~/utils/generell.util";
import { KvinneIkon } from "./Ikoner/KvinneIkon";
import { MennIkon } from "./Ikoner/MennIkon";

interface IProps {
  mottaker: IMottaker;
}

export function Personalia({ mottaker }: IProps) {
  // Todo: Finn ut om vi har denne data
  const sisteOppdatert = "21.03.2025, kl 12:04";

  return (
    <Box background="surface-default" padding="4" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" wrap={false} align="center">
        {erEnKvinne(mottaker.pnr) ? <KvinneIkon /> : <MennIkon />}
        <HStack gap="4" align="center">
          <BodyShort weight="semibold">{mottaker.navn}</BodyShort>
          <BodyShort>/</BodyShort>
          <HStack align="center">
            <BodyShort>{mottaker.pnr}</BodyShort>
          </HStack>
        </HStack>
        <Spacer />
        <HStack gap="4" align="center">
          <BodyShort size="small">{`Sist oppdatert: ${sisteOppdatert}`}</BodyShort>
          <Button variant="secondary" size="small">
            Hent inntekter på nytt
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

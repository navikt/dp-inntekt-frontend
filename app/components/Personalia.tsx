import { BodyShort, Box, Button, HStack, Spacer } from "@navikt/ds-react";
import type { IMottaker } from "~/types/inntekt.types";
import { erEnKvinne } from "~/utils/generell.util";
import { KvinneIkon } from "./Ikoner/KvinneIkon";
import { MennIkon } from "./Ikoner/MennIkon";

interface IProps {
  mottaker: IMottaker;
}

export function Personalia({ mottaker }: IProps) {
  const date = new Date();
  const sisteHentet = date.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          <BodyShort size="small">{`Siste hentet: ${sisteHentet}`}</BodyShort>
          <Button variant="secondary" size="small" onClick={() => window.location.reload()}>
            Hent inntekter på nytt
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

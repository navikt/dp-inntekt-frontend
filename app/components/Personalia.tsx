import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import { BodyShort, Box, Button, CopyButton, HStack, Spacer } from "@navikt/ds-react";
import { KvinneIkon } from "./Ikoner/KvinneIkon";

interface IProps {
  navn: string;
  pnr: string;
  sistOppdatert: string;
}

export function Personalia({ navn, pnr, sistOppdatert }: IProps) {
  return (
    <Box background="surface-default" padding="6" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" wrap={false} align="center">
        <KvinneIkon />
        <HStack gap="4" align="center">
          <BodyShort weight="semibold">{navn}</BodyShort>
          <BodyShort>/</BodyShort>
          <BodyShort>{pnr}</BodyShort>
          <CopyButton copyText={pnr} />
        </HStack>
        <Spacer />
        <HStack gap="4" align="center">
          <BodyShort size="small">{`Sist oppdatert: ${sistOppdatert}`}</BodyShort>
          <Button
            variant="secondary"
            size="small"
            icon={<ArrowsCirclepathIcon title="star" fontSize="1.5rem" />}
            iconPosition="right"
          >
            Hent inntekter på nytt
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

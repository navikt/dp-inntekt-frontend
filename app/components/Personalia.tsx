import { FloppydiskIcon } from "@navikt/aksel-icons";
import { BodyShort, Box, Button, CopyButton, HStack, Spacer } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { erEnKvinne } from "~/utils/generell.util";
import { KvinneIkon } from "./Ikoner/KvinneIkon";
import { MennIkon } from "./Ikoner/MennIkon";

export function Personalia() {
  const { mottaker } = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const { inntektEndret, setKlarForLagring } = useInntekt();

  return (
    <Box background="surface-default" padding="4" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" wrap={false} align="center">
        {erEnKvinne(mottaker.pnr) ? <KvinneIkon /> : <MennIkon />}
        <HStack gap="4" align="center">
          <BodyShort weight="semibold">{mottaker.navn}</BodyShort>
          <BodyShort>/</BodyShort>
          <HStack align="center" gap="2">
            <BodyShort>F.nr: {mottaker.pnr}</BodyShort>
            <CopyButton copyText={mottaker.pnr} />
          </HStack>
        </HStack>
        <Spacer />
        <HStack gap="4" align="center">
          <Button
            variant="primary"
            size="small"
            icon={<FloppydiskIcon title="a11y-title" fontSize="1.2rem" />}
            disabled={!inntektEndret}
            type="submit"
            onClick={() => {
              setKlarForLagring(true);
            }}
          >
            Lagre endringer
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

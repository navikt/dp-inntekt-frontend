import { FloppydiskIcon } from "@navikt/aksel-icons";
import { BodyShort, Box, Button, CopyButton, HStack, Spacer } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import type { IMottaker } from "~/types/inntekt.types";
import { erEnKvinne } from "~/utils/generell.util";
import { KvinneIkon } from "./Ikoner/KvinneIkon";
import { MennIkon } from "./Ikoner/MennIkon";

interface IProps {
  mottaker: IMottaker;
}

export function Personalia({ mottaker }: IProps) {
  const { inntektEndret, setKlarForLagring, contextVirsomheter, setContextViksomheter } =
    useInntekt();

  function slettKiwi() {
    const filtertListe = [...contextVirsomheter].filter((virksomhet) => {
      return virksomhet.virksomhetsnummer !== "937846231";
    });

    setContextViksomheter(filtertListe);
  }

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
          <Button size="small" variant="secondary" onClick={() => slettKiwi()}>
            Slett Kiwi
          </Button>
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

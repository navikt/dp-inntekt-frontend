import { BodyShort, Box, VStack } from "@navikt/ds-react";
import type { IPeriode, IVirksomhet } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { sumTotaltInntekterForAlleVirksomheter } from "~/utils/inntekt.util";

interface IProps {
  virksomheter: IVirksomhet[];
  inntektsPeriode: IPeriode;
}

export function InntektPerioderOppsummering({ virksomheter, inntektsPeriode }: IProps) {
  const { fraOgMed, tilOgMed } = inntektsPeriode;
  const inntektPerioderTotaltBelop = sumTotaltInntekterForAlleVirksomheter(virksomheter);

  return (
    <Box padding="2">
      <VStack>
        <BodyShort>Inntektsperiode</BodyShort>
        <BodyShort>
          {formaterNorskDato(fraOgMed)} - {formaterNorskDato(tilOgMed)}
        </BodyShort>
        <BodyShort weight="semibold" size="large">
          {formatterNorskTall(inntektPerioderTotaltBelop)}
        </BodyShort>
      </VStack>
    </Box>
  );
}

import { BodyShort, Box, VStack } from "@navikt/ds-react";
import type { IPeriode, IVirksomhetsinntekt } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { sumTotalBelopForHelePeriode } from "~/utils/inntekt.util";

interface IProps {
  virksomhetsinntekt: IVirksomhetsinntekt[];
  inntektsPeriode: IPeriode;
}

export function InntektPerioderOppsummering({ virksomhetsinntekt, inntektsPeriode }: IProps) {
  const { fra, til } = inntektsPeriode;
  const inntektPerioderTotaltBelop = sumTotalBelopForHelePeriode(virksomhetsinntekt);

  return (
    <Box padding="2">
      <VStack>
        <BodyShort>Innteksperiode</BodyShort>
        <BodyShort>
          {formaterNorskDato(fra)} - {formaterNorskDato(til)}
        </BodyShort>
        <BodyShort weight="semibold" size="large">
          {formatterNorskTall(inntektPerioderTotaltBelop)}
        </BodyShort>
      </VStack>
    </Box>
  );
}

import { BodyShort, Box, VStack } from "@navikt/ds-react";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { finnInntektsPeriode, sumTotalBelop } from "~/utils/inntekt.util";

interface IProps {
  uklassifisertInntekt: IUklassifisertInntekt;
}

export function InntektPerioderOppsummering({ uklassifisertInntekt }: IProps) {
  const { fra, til } = finnInntektsPeriode(uklassifisertInntekt.inntektVirksomhetMaaned);
  const inntektPerioderTotaltBelop = sumTotalBelop(uklassifisertInntekt.inntektVirksomhetMaaned);

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

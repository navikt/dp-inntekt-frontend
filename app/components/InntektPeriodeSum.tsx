import { BodyShort, Box, VStack } from "@navikt/ds-react";
import type { IVirksomhetsinntekt } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { finnTidligsteOgSenestePeriode, sumTotalBelopForHelePeriode } from "~/utils/inntekt.util";

interface IProps {
  virksomhetsinntekt: IVirksomhetsinntekt[];
}

export function InntektPerioderOppsummering({ virksomhetsinntekt }: IProps) {
  const { fra, til } = finnTidligsteOgSenestePeriode(virksomhetsinntekt);
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

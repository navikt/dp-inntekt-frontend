import { BodyShort, Box, VStack } from "@navikt/ds-react";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";

interface IProps {
  periode: { fom: string; tom: string };
  sum: number;
}

export function InntektPeriodeSum({ periode, sum }: IProps) {
  return (
    <Box padding="2">
      <VStack>
        <BodyShort>Innteksperiode</BodyShort>
        <BodyShort>
          {formaterNorskDato(periode.fom)} - {formaterNorskDato(periode.tom)}
        </BodyShort>
        <BodyShort weight="semibold" size="large">
          {formatterNorskTall(sum)} kr
        </BodyShort>
      </VStack>
    </Box>
  );
}

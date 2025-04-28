import { BodyShort, Box, VStack } from "@navikt/ds-react";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";

interface IProps {
  periode: { fra: string; til: string };
  sum: number;
}

export function InntektPeriodeSum({ periode, sum }: IProps) {
  return (
    <Box padding="2">
      <VStack>
        <BodyShort>Innteksperiode</BodyShort>
        <BodyShort>
          {formaterNorskDato(periode.fra)} - {formaterNorskDato(periode.til)}
        </BodyShort>
        <BodyShort weight="semibold" size="large">
          {formatterNorskTall(sum)}
        </BodyShort>
      </VStack>
    </Box>
  );
}

import { BodyShort, Box, VStack } from "@navikt/ds-react";

interface IProps {
  fom: string;
  tom: string;
  sum: number;
}

export function InntektPeriodeSum({ fom, tom, sum }: IProps) {
  return (
    <Box padding="2">
      <VStack>
        <BodyShort>Innteksperiode</BodyShort>
        <BodyShort>
          {fom} - {tom}
        </BodyShort>
        <BodyShort weight="semibold" size="large">
          {sum} kr
        </BodyShort>
      </VStack>
    </Box>
  );
}

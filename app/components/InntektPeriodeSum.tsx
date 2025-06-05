import { BodyShort, Box, VStack } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { sumTotaltInntekterForAlleVirksomheter } from "~/utils/inntekt.util";

export function InntektPerioderOppsummering() {
  const { periode } = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const { contextVirsomheter } = useInntekt();
  const inntektPerioderTotaltBelop = sumTotaltInntekterForAlleVirksomheter(contextVirsomheter);

  return (
    <Box padding="2">
      <VStack>
        <BodyShort>Inntektsperiode</BodyShort>
        <BodyShort>
          {formaterNorskDato(periode.fraOgMed)} - {formaterNorskDato(periode.tilOgMed)}
        </BodyShort>
        <BodyShort weight="semibold" size="large">
          {formatterNorskTall(inntektPerioderTotaltBelop)}
        </BodyShort>
      </VStack>
    </Box>
  );
}

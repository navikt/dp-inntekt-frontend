import { Box, HStack, VStack } from "@navikt/ds-react";
import { data, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import InntektExpansionCard from "~/components/InntektExpansionCard";
import { InntektPeriodeSum } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKildeModal from "~/components/LeggTilInntektskildeModal";
import { Personalia } from "~/components/Personalia";
import { hentUklassifisertInntekt } from "~/models/inntekt.server";
import type { Route } from "./+types/_index";
import type { InntektVirksomhetMaaned } from "~/types/inntekt.types";
import { finnInntektsPeriode, sumTotalBelop } from "~/utils/inntekt.util";

export async function loader({ request }: Route.LoaderArgs) {
  const uklassifisertInntekt = await hentUklassifisertInntekt(request, "123");

  return { uklassifisertInntekt };
}

export default function Index() {
  const { uklassifisertInntekt } = useLoaderData<typeof loader>();

  if (uklassifisertInntekt.status === "error") {
    return <>Error page</>;
  }

  const { data } = uklassifisertInntekt;

  const pnr = data.mottaker.pnr;
  const navn = data.mottaker.navn;

  // Todo: fiks denne
  const sisteOppdatert = "21.03.2025, kl 12:04";

  return (
    <main>
      <VStack gap="6">
        <Header tittel="Dagpenger inntekt" />
        <Personalia navn={navn} pnr={pnr} sistOppdatert={sisteOppdatert} />
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <InntektPeriodeSum
            periode={finnInntektsPeriode(data.inntektVirksomhetMaaned)}
            sum={sumTotalBelop(data.inntektVirksomhetMaaned)}
          />
          <LeggTilInntektsKildeModal />
        </Box>

        {data.inntektVirksomhetMaaned.map((virksomhet: InntektVirksomhetMaaned) => (
          <InntektExpansionCard key={virksomhet.virksomhetNavn} virksomhet={virksomhet} />
        ))}
      </VStack>
    </main>
  );
}

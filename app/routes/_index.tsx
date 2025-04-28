import { Box, HStack, VStack } from "@navikt/ds-react";
import { data, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import InntektExpansionCard from "~/components/InntektExpansionCard";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKildeModal from "~/components/LeggTilInntektskildeModal";
import { Personalia } from "~/components/Personalia";
import { hentUklassifisertInntekt } from "~/models/inntekt.server";
import type { Route } from "./+types/_index";
import type { IInntektVirksomhetMaaned } from "~/types/inntekt.types";
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

  return (
    <main>
      <VStack gap="6">
        <Header tittel="Dagpenger inntekt" />
        <Personalia mottaker={uklassifisertInntekt.data.mottaker} />
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <InntektPerioderOppsummering uklassifisertInntekt={uklassifisertInntekt.data} />
        </Box>

        <Box background="surface-default" padding="6" borderRadius="xlarge">
          {uklassifisertInntekt.data.inntektVirksomhetMaaned.map(
            (virksomhet: IInntektVirksomhetMaaned) => (
              <InntektExpansionCard key={virksomhet.virksomhetNavn} virksomhet={virksomhet} />
            )
          )}

          <LeggTilInntektsKildeModal />
        </Box>
      </VStack>
    </main>
  );
}

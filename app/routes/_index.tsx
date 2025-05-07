import { Box, VStack } from "@navikt/ds-react";
import { redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import InntektExpansionCard from "~/components/InntektExpansionCard";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKildeModal from "~/components/LeggTillInntektskildeModal/LeggTilInntektskildeModal";
import { Personalia } from "~/components/Personalia";
import { hentUklassifisertInntekt } from "~/models/inntekt.server";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Todo: fjern hardkodet inntektId
  url.searchParams.set("inntektId", "1234");
  const inntektId = url.searchParams.get("inntektId");

  // Nullsjekk for å sjekke om inntekt Id mangler
  invariant(inntektId, "Mangler inntektId");
  const uklassifisertInntekt = await hentUklassifisertInntekt(request, inntektId);

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
          <VStack gap="4">
            {uklassifisertInntekt.data.inntektVirksomhetMaaned.map((virksomhet) => (
              <InntektExpansionCard
                key={virksomhet.virksomhetNavn}
                inntektVirksomhetMaaned={virksomhet}
              />
            ))}
          </VStack>
          <LeggTilInntektsKildeModal />
        </Box>
      </VStack>
    </main>
  );
}

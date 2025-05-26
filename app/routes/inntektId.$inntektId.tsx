import { Box, VStack } from "@navikt/ds-react";
import { data, redirect, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import Virksomhet from "~/components/Virksomhet";
import { hentInntek } from "~/models/inntekt.server";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/_index";

// Henting av inntekten basert på inntektId fra URL-en
export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.inntektId) {
    return redirect("/sok");
  }

  const inntektResponse = await hentInntek(request, params.inntektId);

  if (!inntektResponse.ok) {
    throw new Response("Feil ved henting av inntekter", {
      status: inntektResponse.status,
      statusText: inntektResponse.statusText,
    });
  }

  const inntektData: IUklassifisertInntekt = await inntektResponse.json();

  return data(inntektData);
}

export default function Inntekt() {
  // virksomhetsinntekt er en liste med inntekter for hver virksomhet
  const { periode, mottaker, virksomheter } = useLoaderData<typeof loader>();

  return (
    <main>
      <VStack gap="6">
        <Header tittel="Dagpenger inntekt" />
        <Personalia mottaker={mottaker} />
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <InntektPerioderOppsummering
            virksomheter={virksomheter}
            inntektsPeriode={periode}
          />
        </Box>
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <VStack gap="4">
            {virksomheter.map((virksomhet) => (
              <Virksomhet
                key={virksomhet.virksomhetsnummer}
                virksomhet={virksomhet}
                inntektsPeriode={periode}
              />
            ))}
          </VStack>
          <LeggTilInntektsKilde />
        </Box>
      </VStack>
    </main>
  );
}

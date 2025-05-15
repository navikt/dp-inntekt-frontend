import { Box, VStack } from "@navikt/ds-react";
import { data, redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import { hentInntekter as hentInntek, lagreInntekt } from "~/models/inntekt.server";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/_index";
import Virksomhet from "~/components/Virksomhet";

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

// Lagring av inntekten
// Denne funksjonen håndterer lagring av inntekten når brukeren sender inn skjemaet
export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const inntektId = url.searchParams.get("inntektId");
  invariant(inntektId, "Mangler inntekts-ID");

  // const formData = await request.formData();
  // console.log("formData", formData);

  const oppdatertInntekResponse = await lagreInntekt(request, inntektId);

  if (!oppdatertInntekResponse.ok) {
    throw new Response("Feil ved lagring av inntekt", {
      status: oppdatertInntekResponse.status,
      statusText: oppdatertInntekResponse.statusText,
    });
  }

  return redirect(`/inntektId/${oppdatertInntekResponse.text()}`);
}

export default function Inntekt() {
  // virksomhetsinntekt er en liste med inntekter for hver virksomhet
  const { periode, mottaker, virksomhetsinntekt } = useLoaderData<typeof loader>();

  return (
    <main>
      <VStack gap="6">
        <Header tittel="Dagpenger inntekt" />
        <Personalia mottaker={mottaker} />
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <InntektPerioderOppsummering
            virksomheter={virksomhetsinntekt}
            inntektsPeriode={periode}
          />
        </Box>
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <VStack gap="4">
            {virksomhetsinntekt.map((virksomhet) => (
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

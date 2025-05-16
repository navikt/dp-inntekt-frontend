import { Box, VStack } from "@navikt/ds-react";
import { data, redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import { hentInntek, lagreInntekt } from "~/models/inntekt.server";
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
export async function action({ request, params }: Route.ActionArgs) {
  invariant(params.inntektId, "Mangler inntekts-ID");

  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());
  console.log("formData entries", entries);

  const lagreInntektResponse = await lagreInntekt(request, params.inntektId);

  if (!lagreInntektResponse.ok) {
    throw new Response("Feil ved lagring av inntekt", {
      status: lagreInntektResponse.status,
      statusText: lagreInntektResponse.statusText,
    });
  }

  const nyInntektId = await lagreInntektResponse.text();

  return redirect(`/inntektId/${nyInntektId}`);
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

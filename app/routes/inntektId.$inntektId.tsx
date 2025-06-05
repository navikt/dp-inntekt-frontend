import { Box, VStack } from "@navikt/ds-react";
import { data, redirect, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import { Virksomheter } from "~/components/Virksomheter";
import { InntektProvider } from "~/context/inntekt-context";
import { hentInntekt } from "~/models/inntekt.server";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/inntektId.$inntektId";

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.inntektId) {
    return redirect("/sok");
  }

  const inntektResponse = await hentInntekt(request, params.inntektId);

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
  const { periode, mottaker, virksomheter } = useLoaderData<typeof loader>();

  return (
    <InntektProvider virksomheter={virksomheter}>
      <main>
        <VStack gap="6">
          <Header tittel="Dagpenger inntekt" />
          <Personalia mottaker={mottaker} />
          <Box background="surface-default" padding="6" borderRadius="xlarge">
            {/* // Todo: bør vi bruker context virsomheter isteden? */}
            <InntektPerioderOppsummering virksomheter={virksomheter} inntektsPeriode={periode} />
          </Box>
          <Box background="surface-default" padding="6" borderRadius="xlarge">
            <VStack gap="4">
              <Virksomheter />
            </VStack>
            <LeggTilInntektsKilde />
          </Box>
        </VStack>
      </main>
    </InntektProvider>
  );
}

import { Box, VStack } from "@navikt/ds-react";
import { format, subMonths } from "date-fns";
import { data, redirect, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import { Virksomheter } from "~/components/Virksomheter";
import { InntektProvider } from "~/context/inntekt-context";
import { hentInntek } from "~/models/inntekt.server";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/_index";

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

  const idag = new Date();
  const minus36Mnd = subMonths(idag, 36);

  const periode = {
    fra: format(minus36Mnd, "yyyy-MM"),
    til: format(idag, "yyyy-MM"),
  };

  return data({
    virksomheter: inntektData.virksomheter,
    mottaker: inntektData.mottaker,
    periode: periode,
    inntektId: params.inntektId,
  });
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

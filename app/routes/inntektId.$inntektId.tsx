import { Box, VStack } from "@navikt/ds-react";
import { useRef } from "react";
import { data, redirect, useLoaderData } from "react-router";
import { GlobalModal } from "~/components/GlobalModal";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import InntektsKildeModal from "~/components/LeggTilInntektsKilde/InntektsKildeModal";
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
  const loaderData = useLoaderData<typeof loader>();
  const globalModalRef = useRef<HTMLDialogElement>(null);

  return (
    <InntektProvider uklassifisertInntekt={loaderData} globalModalRef={globalModalRef}>
      <main>
        <VStack gap="6">
          <Header tittel="Dagpenger inntekt" />
          <Personalia />
          <Box background="surface-default" padding="6" borderRadius="xlarge">
            <InntektPerioderOppsummering />
          </Box>
          <Box background="surface-default" padding="6" borderRadius="xlarge">
            <VStack gap="4">
              <Virksomheter />
            </VStack>
          </Box>
        </VStack>

        <InntektsKildeModal />
        <GlobalModal />
      </main>
    </InntektProvider>
  );
}

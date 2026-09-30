import { Box, LocalAlert, VStack } from "@navikt/ds-react";
import { useRef } from "react";
import { data, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import InntektsKildeModal from "~/components/LeggTilInntektsKilde/InntektsKildeModal";
import { Personalia } from "~/components/Personalia";
import { SlettModal } from "~/components/SlettModal";
import { Virksomheter } from "~/components/Virksomheter";
import { InntektProvider } from "~/context/inntekt-context";
import { useInntektSeachParams } from "~/hooks/useInntektSeachParams";
import { hentInntekt } from "~/models/inntekt.server";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/inntektId.$inntektId";

export async function loader({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const opplysningTypeId = url.searchParams.get("opplysningId");
  const behandlingId = url.searchParams.get("behandlingId");
  const erArena = url.searchParams.get("erArena");

  if (!params.inntektId) {
    Error("Mangler inntektId i params");
  }

  const erArenaBoolean = erArena === "true";
  const manglerDpSakIder = !opplysningTypeId || !behandlingId;

  if (!erArenaBoolean && manglerDpSakIder) {
    Error("Bruker kommer fra dp-sak, men mangler opplysningId eller behandlingId");
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
  const slettModalRef = useRef<HTMLDialogElement>(null);
  const { inntektLagret } = useInntektSeachParams();

  return (
    <InntektProvider uklassifisertInntekt={loaderData} slettModalRef={slettModalRef}>
      <main>
        <VStack gap="space-24">
          <Header tittel="Dagpenger inntekt" />
          {inntektLagret && (
            <LocalAlert status="warning">
              <LocalAlert.Header>
                <LocalAlert.Title>
                  Inntekten er lagret
                </LocalAlert.Title>
              </LocalAlert.Header>
                <LocalAlert.Content>
                    Inntekten er lagret, men opplysnings-ID-en kan ha endret seg. Vil du redigere
                  inntekten på nytt, må du gå tilbake til dp-sak, oppdatere siden og klikke deg inn til
                  inntektsredigeringen på nytt for å få korrekt opplysnings-ID.
                </LocalAlert.Content>
            </LocalAlert>
          )}
          <Personalia />
          <Box background="default" padding="space-24" borderRadius="12">
            <InntektPerioderOppsummering />
          </Box>
          <Box background="default" padding="space-24" borderRadius="12" className="mb-6">
            <VStack gap="space-16">
              <Virksomheter />
            </VStack>
          </Box>
        </VStack>

        <InntektsKildeModal erNyVirksomhet={true} virksomhetsnummer={undefined} />
        <SlettModal />
      </main>
    </InntektProvider>
  );
}

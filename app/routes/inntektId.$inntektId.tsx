import { Box, VStack } from "@navikt/ds-react";
import { data, redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import { hentInntek, lagreInntekt } from "~/models/inntekt.server";
import type { IInntekt, IUklassifisertInntekt, IVirksomhetsinntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/_index";
import Virksomhet from "~/components/Virksomhet";
import { format } from "date-fns";

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

  const {
    inntektskilde,
    organisasjonsnavn,
    organisasjonsnummer,
    inntektstype,
    originalData,
    ...rest
  } = entries;

  const inntekter = Object.entries(rest).map(([key, value]) => {
    const [dato] = key.split("_");
    return {
      dato: format(dato, "yyyy-MM"),
      belop: Number(value),
    };
  });

  function lagNyInntektskilde(): IVirksomhetsinntekt {
    return {
      virksomhetsnummer: organisasjonsnummer as string,
      virksomhetsnavn: organisasjonsnavn as string,
      periode: { fra: "2020-12", til: "2023-11" },
      inntekter: lagNyInntektskildeInntekter(),
      totalBeløp: "0",
      avvikListe: [],
    };
  }

  function lagNyInntektskildeInntekter(): IInntekt[] {
    // Todo: se mer på den her
    const virksomhet = { aktoerType: "ORGANISASJON", identifikator: "2222222" };
    const inntektsmottaker = { aktoerType: "NATURLIG_IDENT", identifikator: "-1" };

    return inntekter.map(({ dato, belop }) => ({
      belop: belop.toString(),
      fordel: "kontantytelse",
      beskrivelse: "lottKunTrygdeavgift",
      inntektskilde: "A-ordningen",
      inntektsstatus: "LoependeInnrapportert",
      leveringstidspunkt: dato,
      utbetaltIMaaned: dato,
      virksomhet,
      inntektsmottaker,
      inngaarIGrunnlagForTrekk: true,
      utloeserArbeidsgiveravgift: true,
      informasjonsstatus: "InngaarAlltid",
      inntektType: inntektstype as string,
      redigert: false,
      begrunnelse: "LOTT_KUN_TRYGDEAVGIFT",
      aarMaaned: dato,
    }));
  }

  // Sende med "appendedInntekt" videre til backend
  const lagreInntektResponse = await lagreInntekt(request, params.inntektId);
  const originalDataParsed = JSON.parse(originalData as string);

  const appendedInntekt = {
    ...originalDataParsed,
    virksomhetsinntekt: [lagNyInntektskilde(), ...originalDataParsed.virksomhetsinntekt],
  };

  console.log(`🔥 appendedInntekt :`, appendedInntekt);

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

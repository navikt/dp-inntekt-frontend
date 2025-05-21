import { format } from "date-fns";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { lagreInntekt } from "~/models/inntekt.server";
import type { IInntekt, IVirksomhetsinntekt } from "~/types/inntekt.types";
import type { Route } from "./+types/_index";

// Lagring av inntekten
// Denne funksjonen håndterer lagring av inntekten når brukeren sender inn skjemaet
export async function action({ request, params }: Route.ActionArgs) {
  invariant(params.inntektId, "Mangler inntekts-ID");

  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());
  const organisasjonsnummer = entries["organisasjonsnummer"] as string;
  const organisasjonsnavn = entries["organisasjonsnavn"] as string;
  const inntektstype = entries["inntektstype"] as string;
  const originalData = entries["originalData"] as string;

  function hentInntekterFraFormData(): { dato: string; belop: string }[] {
    // Henter ut alle inntektene fra formData
    const {
      inntektskilde,
      organisasjonsnavn,
      organisasjonsnummer,
      inntektstype,
      originalData,
      ...rest
    } = entries;

    return Object.entries(rest).map(([key, value]) => {
      const [dato] = key.split("_");
      return {
        dato: format(dato, "yyyy-MM"),
        belop: value.toString(),
      };
    });
  }

  function lagNyInntektskilde(): IVirksomhetsinntekt {
    return {
      virksomhetsnummer: organisasjonsnummer,
      virksomhetsnavn: organisasjonsnavn,
      periode: { fra: "2020-12", til: "2023-11" },
      inntekter: lagNyInntektskildeInntekter(),
      totalBeløp: "0",
      avvikListe: [],
    };
  }

  function lagNyInntektskildeInntekter(): IInntekt[] {
    // Todo: se mer på den her
    const virksomhet = { aktoerType: "ORGANISASJON", identifikator: organisasjonsnummer as string };
    const inntektsmottaker = {
      aktoerType: "NATURLIG_IDENT",
      identifikator: organisasjonsnummer,
    };

    const inntekter = hentInntekterFraFormData();

    return inntekter.map(({ dato, belop }) => ({
      belop: belop.toString(),
      fordel: "",
      beskrivelse: "",
      inntektskilde: "",
      inntektsstatus: "",
      leveringstidspunkt: dato,
      utbetaltIMaaned: dato,
      virksomhet,
      inntektsmottaker,
      inngaarIGrunnlagForTrekk: true,
      utloeserArbeidsgiveravgift: true,
      informasjonsstatus: "",
      inntektType: inntektstype,
      redigert: false,
      begrunnelse: "",
      aarMaaned: dato,
    }));
  }

  // Sende med "appendedInntekt" videre til backend
  const lagreInntektResponse = await lagreInntekt(request, params.inntektId);
  const originalDataParsed = JSON.parse(originalData);

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
